# TubeSearch
YouTube Search module for NodeJS


## Usage
```js
const { search, playlist } = require('tubesearch');
search('chicken soup')
  .then((results) => {
    // Results will be empty if nothing found, otherwise could look like:
    /*
      [ { title: 'Skrillex & Habstrakt - Chicken Soup  [Official Audio]',
          link: 'https://youtube.com/watch?v=22MWrWPV_QM',
          id: '22MWrWPV_QM',
          uploader: 'OWSLA',
          duration: '3:28',
          durationMs: 208000,
          isLiveStream: false },
        { title: 'How to Cook Basic Chicken Soup Easy',
          link: 'https://youtube.com/watch?v=GYPtgtPlpLA',
          id: 'GYPtgtPlpLA',
          uploader: 'OldManCooking',
          duration: '5:45',
          durationMs: 345000,
          isLiveStream: false },
        { title: 'Stock & Chicken Noodle Soup | Basics with Babish',
          link: 'https://youtube.com/watch?v=74tZ-yOOPy0',
          id: '74tZ-yOOPy0',
          uploader: 'Binging with Babish',
          duration: '8:27',
          durationMs: 507000,
          isLiveStream: false } ]
    */
  });

playlist('identifier')
  .then((results) => {
    // Similar to above, results will be empty if nothing found.
    // Otherwise, they could look like:

    /*
      [ { title: 'END-S - BussItDown',
          link: 'https://www.youtube.com/watch?v=BAIZFRoVACI',
          id: 'BAIZFRoVACI',
          uploader: 'A X S T H X T I C .',
          durationMs: 122000 },
        { title: 'VINCCE - Orange CHÄSER',
          link: 'https://www.youtube.com/watch?v=KrFCKuNQQoc',
          id: 'KrFCKuNQQoc',
          uploader: 'A X S T H X T I C .',
          durationMs: 131000 },
        { title: 'Jake OHM - Welcome Home',
          link: 'https://www.youtube.com/watch?v=3OgNPNm0gxU',
          id: '3OgNPNm0gxU',
          uploader: 'A X S T H X T I C .',
          durationMs: 141000 } ]
    */
  })
```
