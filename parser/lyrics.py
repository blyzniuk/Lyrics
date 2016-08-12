#!/usr/bin/python3

import urllib.request
import sys
from bs4 import BeautifulSoup
from pymongo import MongoClient
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
    
    original = {
        'name': soup.find('h2', class_='original').contents[0].lower(),
        'text': get_text(soup.find('div', {'id': 'click_area'}), 'original')
    }
    translation = {
        'name': soup.find('h2', class_='translate').text,
        'text': get_text(soup.find('div', {'id': 'click_area'}), 'translate')
    }
    
    return {
        'original': original,
        'translation': translation
    }

def write_to_db(db, collection, name, items):
    db[str(collection)].insert_one({name: items})

def get_html(url):
    response = urllib.request.urlopen(BASE_URL + url)
    return response.read()

def main():
    client = MongoClient('mongodb://')
    db = client['lyrics']
    categories = get_all_categories()
    exeptions = []
    total_index = 0

    for category in categories:
        artists = get_artists(category)
        count = len(artists)
        
        for index, artist in enumerate(artists):
            print(index + total_index, '/', '8876', count, artist)
            songs_list = get_songs_list(artist['href'])
            songs = []
            for song_href in songs_list:
                songs.append(get_song(artist['href'] + song_href))
            try:
                write_to_db(db, category, artist['name'], songs)
            except :
                exeptions.append({
                    'artist': artist,
                    'exeption': sys.exc_info()
                })
                print(sys.exc_info())
                pass
        total_index += count        

    for i in exeptions:
        print(i)

if __name__ == '__main__':
    main()