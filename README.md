# TubeSearch
YouTube Search module for NodeJS


## Usage
```js
const search = require('tubesearch');
search('chicken soup')
  .then((results) => {
    // Results will either be empty (if nothing found), or will produce something similar to below
    /*
      [ { title: 'Skrillex & Habstrakt - Chicken Soup  [Official Audio]',
          link: 'https://youtube.com/watch?v=22MWrWPV_QM',
          id: '22MWrWPV_QM',
          uploader: 'OWSLA',
          duration: '3:28',
          durationMs: 208000 },
        { title: 'How to Cook Basic Chicken Soup Easy',
          link: 'https://youtube.com/watch?v=GYPtgtPlpLA',
          id: 'GYPtgtPlpLA',
          uploader: 'OldManCooking',
          duration: '5:45',
          durationMs: 345000 },
        { title: 'Stock & Chicken Noodle Soup | Basics with Babish',
          link: 'https://youtube.com/watch?v=74tZ-yOOPy0',
          id: '74tZ-yOOPy0',
          uploader: 'Binging with Babish',
          duration: '8:27',
          durationMs: 507000 } ]
    */
  });
```
