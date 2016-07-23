import urllib.request
from bs4 import BeautifulSoup
from string import ascii_lowercase

#artist_name: {song_name: {language: text}}

BASE_URL = 'http://www.amalgama-lab.com/'

def get_all_categories():
    categories = []
    for i in range(1, 10):
        categories.append(i)
    for i in ascii_lowercase:
        categories.append(i)
    return categories

def get_artists(category):
    artists = []
    soup = BeautifulSoup(get_html('songs/%s/' %category))
    artists_list = soup.find('ul', class_='g').find_all('li')

    for artist in artists_list:
        element = artist.find('a')
        artists.append({
            'name': element.text,
            'href': element.get('href')
        })
    return artists

def get_songs_list(artist_href):
    songs = []
    soup = BeautifulSoup(get_html(artist_href[1:]))
    songs_list = soup.find('div', {'id': 'songs_nav'}).ul.ul.find_all('a')
    
    for song in songs_list:
        songs.append(song.get('href'))

    return songs

def get_text(soup, className):
    text = ''
    for row in soup.find_all('div', class_=className):
        text += row.text

    return text

def get_song(song_href):
    soup = BeautifulSoup(get_html(song_href[1:])).find('div', class_='texts col')
    origin_name = soup.find('h2', class_='original').contents[0]
    ru_name = soup.find('h2', class_='translate').text
    origin_text = get_text(soup.find('div', {'id': 'click_area'}), 'original')
    ru_text = get_text(soup.find('div', {'id': 'click_area'}), 'translate')
    return {
        'name': origin_name,
        'ru_name': ru_name,
        'text': origin_text,
        'ru_text': ru_text
    }

def get_html(url):
    response = urllib.request.urlopen(BASE_URL + url)
    return response.read()

def main():
    categories = get_all_categories()
    artists = []
    for category in categories:
       artists.extend(get_artists(category))
    
    for artist in artists:
        songs_list = get_songs_list(artist.href)
        for song_href in songs_list:
            song = get_song(artist.href + song_href)
            print();
            # write_to_db(artist.name, song)

if __name__ == '__main__':
    main()