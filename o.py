import sys
import requests
from bs4 import BeautifulSoup

def vc(yid):
    url = "https://www.youtube.com/watch?v="+yid
    soup = BeautifulSoup(requests.get(url).text, 'lxml')
    result = soup.select_one('meta[itemprop="interactionCount"][content]')['content']
    return result

a = vc(sys.argv[1])
print(sys.argv[1]+'+'+a)