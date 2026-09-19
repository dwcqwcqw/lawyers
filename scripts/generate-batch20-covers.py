import json,pathlib,textwrap
from PIL import Image,ImageDraw,ImageFont

ROOT=pathlib.Path(__file__).resolve().parents[1]
batch=json.loads((ROOT.parent/'飞书文章审阅/batch20-generated.json').read_text())
font='/System/Library/Fonts/STHeiti Medium.ttc'
font_light='/System/Library/Fonts/STHeiti Light.ttc'
palette={
 'divorce':('#132f43','#b58a52'),'property':('#233c4b','#997044'),'children':('#294a52','#b47d65'),
 'debt':('#293943','#9b665d'),'business-assets':('#233a48','#9f8350'),'agreements':('#463b3c','#b27b62'),
 'inheritance':('#35443f','#a38254'),'shanghai-consultation':('#1f3c4a','#ac7658')}

def wrap(draw,text,f,max_width):
 lines=[];line=''
 for ch in text:
  if draw.textbbox((0,0),line+ch,font=f)[2]<=max_width:line+=ch
  else:lines.append(line);line=ch
 if line:lines.append(line)
 return lines

for item in batch:
 a=item['article'];navy,gold=palette[a['topicSlug']]
 im=Image.new('RGB',(1672,941),'#f5f2eb');d=ImageDraw.Draw(im)
 d.rectangle((0,0,1672,126),fill=navy);d.rectangle((0,126,18,941),fill=gold)
 d.rectangle((1130,126,1672,941),fill='#e7e3da')
 d.ellipse((1240,210,1540,510),outline=gold,width=8);d.line((1170,640,1575,640),fill=navy,width=5)
 d.line((1250,700,1540,700),fill=gold,width=18);d.line((1250,755,1470,755),fill=navy,width=8)
 d.rounded_rectangle((1210,565,1505,620),radius=12,outline=gold,width=5)
 label=ImageFont.truetype(font,34);title=ImageFont.truetype(font,70);small=ImageFont.truetype(font_light,28);idfont=ImageFont.truetype(font,42)
 d.text((86,43),'JIANGHUAI LAW FIRM  ·  GEO 家事指南',font=label,fill='#ffffff')
 d.text((88,196),f'{item["id"]}  |  {a["topicSlug"].upper()}',font=idfont,fill=gold)
 y=300
 for line in wrap(d,a['title'],title,950)[:4]:d.text((86,y),line,font=title,fill=navy);y+=100
 d.line((88,y+20,900,y+20),fill=gold,width=4)
 d.text((88,y+55),'规则 · 证据 · 程序 · 可执行安排',font=small,fill='#56636b')
 d.text((88,855),'上海江怀律师事务所｜主题核查示意图，不代表真实个案',font=small,fill='#6e7475')
 out=ROOT/'public/images/articles'/a['slug']/'hero.webp';out.parent.mkdir(parents=True,exist_ok=True);im.save(out,'WEBP',quality=92,method=6)
print(f'Generated {len(batch)} editorial covers.')
