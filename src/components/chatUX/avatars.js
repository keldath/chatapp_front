import React from 'react';
import Avatar from '@material-ui/core/Avatar';


export default function LetterAvatars(name,color) {

    

 console.log(color)//,backgroundColor:
  return (
      <Avatar style={{display:'inline' ,backgroundColor: color}}>{name}</Avatar>
  );
}