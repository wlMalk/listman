import { LayoutAnimation } from 'react-native';

export const GOALS_HEIGHT = 58
export const HEADER_HEIGHT = 56
export const COUNTERS_HEIGHT = 52

export function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function scale(from, to, length){
  var x = new Array(length).fill(from);
  var diff = (to-from)/(length-1)
  return x.map((n,i)=>n+diff*i)
}

export function repeat(a, len){
  var length = parseInt(len/a.length)
  var na = a.map((n,i)=>{
    return new Array(length+(i<len-length*a.length?1:0)).fill(n)
  })
  na = [].concat.apply([], na)
  return na
}

export function interpolate(value, s1, s2, t1, t2, slope) {
    //Default to linear interpolation
    slope = slope || 0.5;

    //If the value is out of the source range, floor to min/max target values
    if(value < Math.min(s1, s2)) {
        return Math.min(s1, s2) === s1 ? t1 : t2;
    }

    if(value > Math.max(s1, s2)) {
        return Math.max(s1, s2) === s1 ? t1 : t2;
    }

    //Reverse the value, to make it correspond to the target range (this is a side-effect of the bezier calculation)
    value = s2-value;

    var C1 = {x: s1, y:t1}; //Start of bezier curve
    var C3 = {x: s2, y:t2}; //End of bezier curve
    var C2 = {              //Control point
        x: C3.x,
        y: C1.y + Math.abs(slope) * (C3.y - C1.y)
    };

    //Find out how far the value is on the curve
    var percent = value / (C3.x-C1.x);

    return C1.y*b1(percent) + C2.y*b2(percent) + C3.y*b3(percent);

    function b1(t) { return t*t }
    function b2(t) { return 2*t*(1 - t)  }
    function b3(t) { return (1 - t)*(1 - t) }
};

export function getNumberOfLines(text, fontSize, fontConstant, containerWidth){
  if(typeof text != 'undefined'){
    let cpl = Math.floor(containerWidth / (fontSize / fontConstant) );
    const words = text.split(' ');
    const elements = [];
    let line = '';

    while(words.length > 0){
        if(line.length + words[0].length + 1 <= cpl || line.length === 0 && words[0].length + 1 >= cpl){
            let word = words.splice(0,1);
            if(line.length === 0){
                line = word;
            }else {
                line = line + " " + word;
            }
            if(words.length === 0){
                elements.push(line);
            }
        }
        else {
            elements.push(line);
            line = "";
        }
    }
    return elements.length;
  }else{
    return 0
  }
}

export const limits = {
  todayTasks: 10,
  tomorrowTasks: 10,
  timeForChanges: 10,
  importance: 10,
  duration: 10,
  textLength: 100,
}

export const animationConfig = {
    duration: 120,
    update: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
    },
    create: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
    delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    }
};
