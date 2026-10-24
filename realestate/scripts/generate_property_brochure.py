from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / 'output' / 'pdf' / 'elite-estates-portfolio.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = A4
NAVY = colors.HexColor('#0a0a1a')
NAVY2 = colors.HexColor('#151638')
GOLD = colors.HexColor('#d49a20')
GOLD_LIGHT = colors.HexColor('#f3e8c8')
INK = colors.HexColor('#252437')
MUTED = colors.HexColor('#656477')
PAPER = colors.HexColor('#faf8f3')
WHITE = colors.white

font_regular = 'Helvetica'
font_bold = 'Helvetica-Bold'
font_italic = 'Helvetica-Oblique'
font_candidates = [
    (Path('C:/Windows/Fonts/georgia.ttf'), Path('C:/Windows/Fonts/georgiab.ttf'), Path('C:/Windows/Fonts/georgiai.ttf')),
    (Path('C:/Windows/Fonts/arial.ttf'), Path('C:/Windows/Fonts/arialbd.ttf'), Path('C:/Windows/Fonts/ariali.ttf')),
]
for regular, bold, italic in font_candidates:
    if regular.exists() and bold.exists() and italic.exists():
        pdfmetrics.registerFont(TTFont('EstateSerif', str(regular)))
        pdfmetrics.registerFont(TTFont('EstateSerifBold', str(bold)))
        pdfmetrics.registerFont(TTFont('EstateSerifItalic', str(italic)))
        font_regular, font_bold, font_italic = 'EstateSerif', 'EstateSerifBold', 'EstateSerifItalic'
        break

properties = [
    ('Auris Serenity Signature', 'Malad West, Link Road, Mumbai', 'FOR SALE', 'INR 4.85 Cr', '4 BHK', '4 baths', '3,450 sq.ft', 'A high-floor residence with Arabian Sea views, Italian stonework, home automation, and access to a private residents clubhouse.'),
    ('The Belvedere Private Estate Villas', 'Whitefield, Bengaluru', 'FOR RENT', 'INR 1,85,000 / mo', '5 BHK', '5 baths', '5,600 sq.ft', 'A private gated villa with manicured lawns, an infinity pool, a wine vault, and EV charging.'),
    ('Trump Tower Sky Penthouse', 'Worli Sea Face, Mumbai', 'FOR SALE', 'INR 12.5 Cr', '5 BHK', '6 baths', '6,800 sq.ft', 'A duplex penthouse with double-height ceilings, a private sky-deck pool, and concierge service.'),
    ('Oceanic Views Seafront Apartment', 'Marine Drive, South Mumbai', 'FOR SALE', 'INR 3.2 Cr', '3 BHK', '3 baths', '2,450 sq.ft', 'An Art Deco-inspired waterfront home overlooking the Queen\'s Necklace, with generous ceilings and designer fixtures.'),
    ('Orchid Enclave Hillside Villa', 'Jubilee Hills, Hyderabad', 'FOR RENT', 'INR 1,15,000 / mo', '4 BHK', '4 baths', '4,800 sq.ft', 'A refined private residence with marble flooring, a double-height foyer, theatre space, and lush courtyards.'),
    ('Botanica Eco-Villas', 'Electronic City, Bengaluru', 'FOR SALE', 'INR 1.5 Cr', '3 BHK', '3 baths', '2,900 sq.ft', 'A sustainable villa in a wooded community, with natural temperature regulation and a private organic garden.'),
    ('Sunset Horizon Beach Mansion', 'East Coast Road, Chennai', 'FOR SALE', 'INR 8.9 Cr', '6 BHK', '7 baths', '7,500 sq.ft', 'A coastal estate on the Bay of Bengal with direct beach access, a private pool, and a teak terrace.'),
    ('Valley View Mountain Retreat', 'Tiger Point Road, Lonavala', 'FOR RENT', 'INR 2,50,000 / mo', '5 BHK', '5 baths', '5,400 sq.ft', 'A hillside retreat with valley views, a heated infinity pool, fireplace lounge, and private stargazing terrace.'),
]

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Eyebrow', fontName=font_bold, fontSize=8, leading=11, textColor=GOLD, tracking=1.7, spaceAfter=5))
styles.add(ParagraphStyle(name='CoverTitle', fontName=font_regular, fontSize=36, leading=39, textColor=WHITE, alignment=TA_LEFT))
styles.add(ParagraphStyle(name='CoverItalic', fontName=font_italic, fontSize=36, leading=39, textColor=colors.HexColor('#f1c65e')))
styles.add(ParagraphStyle(name='CoverSub', fontName='Helvetica', fontSize=11, leading=18, textColor=colors.HexColor('#ddddeb')))
styles.add(ParagraphStyle(name='SectionTitle', fontName=font_regular, fontSize=25, leading=29, textColor=NAVY, spaceAfter=4))
styles.add(ParagraphStyle(name='SectionSub', fontName='Helvetica', fontSize=9, leading=14, textColor=MUTED, spaceAfter=13))
styles.add(ParagraphStyle(name='CardTitle', fontName=font_bold, fontSize=11.2, leading=14, textColor=NAVY, spaceAfter=3))
styles.add(ParagraphStyle(name='CardLocation', fontName='Helvetica', fontSize=8.2, leading=11, textColor=MUTED, spaceAfter=7))
styles.add(ParagraphStyle(name='CardPrice', fontName=font_bold, fontSize=10.5, leading=13, textColor=GOLD, spaceAfter=7))
styles.add(ParagraphStyle(name='CardBody', fontName='Helvetica', fontSize=8.1, leading=12, textColor=INK))
styles.add(ParagraphStyle(name='CardBodyLight', fontName='Helvetica', fontSize=8.1, leading=12, textColor=colors.HexColor('#e2e1ec')))
styles.add(ParagraphStyle(name='CardBodyAccent', fontName='Helvetica', fontSize=8.1, leading=12, textColor=colors.HexColor('#e2e1ec')))
styles.add(ParagraphStyle(name='CardMeta', fontName=font_bold, fontSize=7.1, leading=10, textColor=NAVY2))
styles.add(ParagraphStyle(name='CardTag', fontName=font_bold, fontSize=7, leading=9, textColor=GOLD))
styles.add(ParagraphStyle(name='Footer', fontName='Helvetica', fontSize=7, leading=9, textColor=colors.HexColor('#a7a7b6')))

def draw_page(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, W, H, fill=1, stroke=0)
        canvas.setFillColor(NAVY2)
        canvas.circle(W + 8*mm, H - 20*mm, 88*mm, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor('#20204a'))
        canvas.circle(W + 4*mm, H - 24*mm, 65*mm, fill=1, stroke=0)
        canvas.setStrokeColor(colors.HexColor('#80621f'))
        canvas.setLineWidth(.7)
        canvas.circle(W + 5*mm, H - 20*mm, 72*mm, fill=0, stroke=1)
        canvas.setFillColor(GOLD)
        canvas.roundRect(20*mm, 32*mm, 13*mm, 2*mm, 1*mm, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor('#ddddeb'))
        canvas.setFont('Helvetica', 8)
        canvas.drawString(20*mm, 25*mm, 'CURATED HOMES  /  INDIA')
    else:
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, W, H, fill=1, stroke=0)
        canvas.setStrokeColor(colors.HexColor('#e7dfcd'))
        canvas.setLineWidth(.6)
        canvas.line(18*mm, 17*mm, W-18*mm, 17*mm)
        canvas.setFont('Helvetica-Bold', 7)
        canvas.setFillColor(NAVY)
        canvas.drawString(18*mm, 12*mm, 'ELITE ESTATES')
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(W-18*mm, 12*mm, f'PROPERTY COLLECTION  ·  {doc.page-1:02d}')
    canvas.restoreState()

class EstateDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(str(filename), pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=20*mm, bottomMargin=23*mm, title='Elite Estates | Property Collection', author='Elite Estates')
        cover = Frame(20*mm, 27*mm, W-40*mm, H-54*mm, id='cover', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        body = Frame(20*mm, 23*mm, W-40*mm, H-40*mm, id='body', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates([PageTemplate(id='cover', frames=cover, onPage=draw_page, autoNextPageTemplate='body'), PageTemplate(id='body', frames=body, onPage=draw_page)])

def card(prop):
    title, location, status, price, beds, baths, area, desc = prop
    content = [
        Paragraph(status, styles['CardTag']),
        Paragraph(title, styles['CardTitle']),
        Paragraph(location, styles['CardLocation']),
        Paragraph(price, styles['CardPrice']),
        Table([[Paragraph(beds, styles['CardMeta']), Paragraph(baths, styles['CardMeta']), Paragraph(area, styles['CardMeta'])]], colWidths=[23*mm, 23*mm, 30*mm], style=TableStyle([
            ('BACKGROUND',(0,0),(-1,-1),GOLD_LIGHT), ('BOX',(0,0),(-1,-1),.3,colors.HexColor('#e7d7b0')),
            ('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),3),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)
        ])),
        Spacer(1, 7),
        Paragraph(desc, styles['CardBody'])
    ]
    table = Table([[content]], colWidths=[82*mm], style=TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),WHITE), ('BOX',(0,0),(-1,-1),.6,colors.HexColor('#e7dfcd')),
        ('LINEBEFORE',(0,0),(0,0),2.5,GOLD), ('LEFTPADDING',(0,0),(-1,-1),11),
        ('RIGHTPADDING',(0,0),(-1,-1),11), ('TOPPADDING',(0,0),(-1,-1),11), ('BOTTOMPADDING',(0,0),(-1,-1),12),
    ]))
    return table

story = [
    Spacer(1, 36*mm),
    Paragraph('ELITE ESTATES  /  PRIVATE COLLECTION', styles['Eyebrow']),
    Spacer(1, 5*mm),
    Paragraph('Exceptional<br/>Homes, <font name="EstateSerifItalic" color="#f1c65e">Thoughtfully</font><br/>Chosen.', styles['CoverTitle']),
    Spacer(1, 8*mm),
    Paragraph('A curated portfolio of distinctive residences across India. Discover considered architecture, remarkable locations, and service shaped around the way you want to live.', styles['CoverSub']),
    Spacer(1, 27*mm),
    Table([[Paragraph('<font color="#f1c65e"><b>08</b></font><br/><font color="#ddddeb">CURATED HOMES</font>', styles['CoverSub']), Paragraph('<font color="#f1c65e"><b>05</b></font><br/><font color="#ddddeb">CITIES & RETREATS</font>', styles['CoverSub']), Paragraph('<font color="#f1c65e"><b>BUY / RENT</b></font><br/><font color="#ddddeb">FLEXIBLE LIVING</font>', styles['CoverSub'])]], colWidths=[53*mm, 53*mm, 53*mm], style=TableStyle([
        ('LINEABOVE',(0,0),(-1,-1),.7,colors.HexColor('#5c4a24')),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),8),('VALIGN',(0,0),(-1,-1),'TOP')
    ])),
    PageBreak(),
    Paragraph('THE COLLECTION', styles['Eyebrow']),
    Paragraph('City residences', styles['SectionTitle']),
    Paragraph('A selection of city homes for a life connected to the energy of India’s most sought-after addresses.', styles['SectionSub']),
]
for i in range(0, 4, 2):
    story.append(Table([[card(properties[i]), card(properties[i+1])]], colWidths=[87*mm, 87*mm], style=TableStyle([
        ('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),4),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),7)
    ])))
    story.append(Spacer(1, 5))
story += [
    PageBreak(),
    Paragraph('THE COLLECTION', styles['Eyebrow']),
    Paragraph('Private escapes', styles['SectionTitle']),
    Paragraph('Space to slow down, recharge, and enjoy a different view of home.', styles['SectionSub']),
]
for i in range(4, 8, 2):
    story.append(Table([[card(properties[i]), card(properties[i+1])]], colWidths=[87*mm, 87*mm], style=TableStyle([
        ('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),4),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),7)
    ])))
    story.append(Spacer(1, 5))
story += [
    Spacer(1, 5),
    Table([[Paragraph('<font color="#ffffff"><b>Arrange a private viewing</b></font><br/>Speak with our property advisors to explore availability, arrange a tour, or discover a home suited to your plans.', styles['CardBodyLight']), Paragraph('<font color="#d49a20"><b>ELITE ESTATES</b></font><br/>Curating exceptional living experiences since 2009.', styles['CardBodyAccent'])]], colWidths=[86*mm, 86*mm], style=TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),NAVY),('TEXTCOLOR',(0,0),(-1,-1),WHITE),('BOX',(0,0),(-1,-1),0,NAVY),
        ('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),12),('BOTTOMPADDING',(0,0),(-1,-1),12),('VALIGN',(0,0),(-1,-1),'MIDDLE')
    ]))
]

doc = EstateDoc(OUT)
doc.build(story)
print(OUT)
