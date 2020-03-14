import React from 'react';

const Searcher = props =>(
   <div>
       {props.song.map(x=> {
               console.log(x.title)
               return (
                   <h2> x.title</h2>
               )
           }
           )
       }
   </div>
)
export default Searcher;
