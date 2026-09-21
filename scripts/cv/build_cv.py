"""Build bilingual, two-page resumes from cv.json.

Install scripts/cv/requirements.txt, then run python scripts/cv/build_cv.py.
Georgia fonts are loaded from Windows; use --fonts on other systems.
PDFs embed Unicode fonts and preserve selectable text and clickable links.
"""
import argparse
import json
import os
import re
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

INK = colors.HexColor('#1a1a1a')
MUTED = colors.HexColor('#555555')
RULE = colors.HexColor('#c6c6c6')
MARGIN = 48
WIDTH = letter[0] - MARGIN * 2


def register_fonts(directory):
    for name, filename in [('CV', 'georgia.ttf'), ('CV-Bold', 'georgiab.ttf'), ('CV-Italic', 'georgiai.ttf'), ('CV-BoldItalic', 'georgiaz.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(directory / filename)))
    pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold', italic='CV-Italic', boldItalic='CV-BoldItalic')


def markup(text):
    """Support paired bold markers, escaping content before adding markup."""
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', escape(text))


def styles():
    body = ParagraphStyle('body', fontName='CV', fontSize=10, leading=13.4, textColor=INK)
    return {
        'body': body,
        'name': ParagraphStyle('name', parent=body, fontName='CV-Bold', fontSize=18, leading=23, alignment=TA_CENTER),
        'headline': ParagraphStyle('headline', parent=body, fontName='CV-Italic', fontSize=10.5, leading=16, alignment=TA_CENTER),
        'contact': ParagraphStyle('contact', parent=body, fontSize=8.6, leading=12, alignment=TA_CENTER, textColor=MUTED),
        'heading': ParagraphStyle('heading', parent=body, fontName='CV-Bold', fontSize=10, leading=14, spaceBefore=13, spaceAfter=4, keepWithNext=True),
        'company': ParagraphStyle('company', parent=body, fontName='CV-Bold', fontSize=10, leading=13),
        'role': ParagraphStyle('role', parent=body, fontName='CV-Italic', fontSize=9.2, leading=12),
        'meta': ParagraphStyle('meta', parent=body, fontSize=8.5, leading=12, textColor=MUTED),
        'bullet': ParagraphStyle('bullet', parent=body, leftIndent=10, firstLineIndent=-10, spaceAfter=3),
        'skill': ParagraphStyle('skill', parent=body, fontSize=9.4, leading=13, spaceAfter=4),
    }


def section(title, style):
    rule = HRFlowable(width='100%', thickness=0.5, color=RULE, spaceAfter=7)
    rule.keepWithNext = True
    return [Paragraph(escape(title), style['heading']), rule]


def role_header(role, style):
    right = ParagraphStyle('right', parent=style['meta'], alignment=TA_RIGHT)
    table = Table([
        [Paragraph(escape(role['company']), style['company']), Paragraph(escape(role['dates']), right)],
        [Paragraph(escape(role['title']), style['role']), Paragraph(escape(role['place']), right)],
    ], colWidths=[WIDTH * 0.66, WIDTH * 0.34])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (0, -1), 10),
        ('RIGHTPADDING', (1, 0), (1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    return table


def bullet(text, style):
    return Paragraph('- ' + markup(text), style['bullet'])


def story(meta, cv, style):
    content = [Paragraph(escape(meta['name'].upper()), style['name']), Paragraph(escape(cv['headline']), style['headline'])]
    for line in meta['contact']:
        content.append(Paragraph(escape(line), style['contact']))
    links = ' &nbsp; | &nbsp; '.join(f'<link href="{escape(link["href"], quote=True)}">{escape(link["label"])}</link>' for link in meta['links'])
    content.append(Paragraph(links, style['contact']))
    content.extend(section(cv['profile']['heading'], style))
    content.append(Paragraph(markup(cv['profile']['text']), style['body']))
    content.extend(section(cv['experience']['heading'], style))
    for role in cv['experience']['roles']:
        entries = [role_header(role, style), Spacer(1, 3)]
        entries.extend(bullet(line, style) for line in role['bullets'])
        content.extend([KeepTogether(entries), Spacer(1, 6)])
    content.extend(section(cv['projects']['heading'], style))
    for project in cv['projects']['items']:
        title = f'<link href="{escape(project["href"], quote=True)}"><b>{escape(project["name"])}</b></link>'
        content.append(KeepTogether([
            Paragraph(title + ' - ' + markup(project['text']), style['body']),
            Paragraph(escape(project['stack']), style['meta']), Spacer(1, 8),
        ]))
    content.extend(section(cv['skills']['heading'], style))
    content.extend(Paragraph(markup(line), style['skill']) for line in cv['skills']['bullets'])
    content.extend(section(cv['education']['heading'], style))
    content.extend([role_header(cv['education']['school'], style), Spacer(1, 6)])
    content.extend(bullet(line, style) for line in cv['education']['bullets'])
    content.extend([Spacer(1, 5), Paragraph(markup(cv['languages']), style['body'])])
    return content


def footer(canvas, document, meta):
    canvas.saveState()
    canvas.setFont('CV', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 25, meta['name'])
    canvas.drawRightString(letter[0] - MARGIN, 25, str(document.page))
    canvas.restoreState()


def main():
    here = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--fonts', type=Path, default=Path(os.environ.get('SystemRoot', 'C:/Windows')) / 'Fonts')
    parser.add_argument('--out', type=Path, default=here.parent.parent / 'public' / 'cv')
    args = parser.parse_args()
    register_fonts(args.fonts)
    data = json.loads((here / 'cv.json').read_text(encoding='utf-8'))
    args.out.mkdir(parents=True, exist_ok=True)
    for locale in ('es', 'en'):
        cv = data[locale]
        target = args.out / cv['file']
        document = SimpleDocTemplate(str(target), pagesize=letter, rightMargin=MARGIN, leftMargin=MARGIN, topMargin=36, bottomMargin=42, title=f'{data["meta"]["name"]} - CV', author=data['meta']['name'], subject=cv['headline'], pageCompression=1)
        def page_footer(canvas, doc):
            footer(canvas, doc, data['meta'])
        document.build(story(data['meta'], cv, styles()), onFirstPage=page_footer, onLaterPages=page_footer)
        if document.page != 2:
            raise ValueError(f'Expected two pages for {locale}, got {document.page}; review the content and layout.')
        print(f'{target.name}: {document.page} pages')


if __name__ == '__main__':
    main()
