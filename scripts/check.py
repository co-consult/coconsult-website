#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import sys
ROOT=Path(__file__).resolve().parent.parent
class Checker(HTMLParser):
  def __init__(self): super().__init__();self.links=[];self.h1=0;self.lang=None;self.canonical=[];self.hreflangs=set()
  def handle_starttag(self, tag, attrs):
    a=dict(attrs)
    if tag=='html':self.lang=a.get('lang')
    if tag=='h1':self.h1+=1
    if tag=='a':self.links.append(a.get('href',''))
    if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
    if tag=='link' and a.get('rel')=='alternate':self.hreflangs.add(a.get('hreflang'))
for name,lang in [('index.html','fr'),('en/index.html','en')]:
 p=ROOT/'site'/name; html=p.read_text(encoding='utf-8'); c=Checker();c.feed(html)
 assert c.lang==lang,(name,'lang')
 assert c.h1==1,(name,'H1 count',c.h1)
 assert len(c.canonical)==1,(name,'canonical')
 assert {'fr','en','x-default'}<=c.hreflangs,(name,'hreflang')
 assert all(v.startswith(('mailto:','#','/')) for v in c.links),(name,'bad link')
 assert '/assets/styles.css' in html and '/assets/main.js' in html
 assert 'contact@coconsult.fr' in html
 print('OK:',name, 'links', len(c.links))
assert (ROOT/'site/assets/styles.css').stat().st_size>2000
assert (ROOT/'site/assets/main.js').stat().st_size>100
print('Static checks passed')
