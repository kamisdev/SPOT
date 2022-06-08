const colors = {
  transparent: 'transparent',
  black: '#000',
  white: '#fff',

  fontMain: '#474A53',
  athensGray: '#E6E8EF',
  doveGray: '#707070',
  silverChalice: '#ACACAC',
  alto: '#D8D8D8',
  alabaster: '#F9F9F9',

  pictonBlue: '#26CFEC',
  bittersweet: '#FD6C59',
  amethyst: '#B447D6',

  //~~~~~~~~~~~~~~
  baliHai: '#8292B2',
  indochine: '#D17000',

  limeade: '#448500',
  malachite: '#01CD31',
  bahia: '#8FDC0E',
  eucalyptus: '#23AF4D',
  kournikova: '#FFDE7A',
  //~~~~~~~~~~~~~~~

  java: '#1EAAC7',
  blueRibbon: '#0468E7',
  redRibbon: '#E70829',

  //gradient
  gradientGreen: ['#8FDC0E', '#448500'],
  gradientGray: ['#bbb', '#474A53'],
  gradientYellow: ['#F5FF0A', '#F6AF08'],

  rgbaBlackColor: tr => `rgba(0,0,0,${tr})`,
  rgbaWhiteColor: tr => `rgba(255,255,255,${tr})`,
  rgbaCustom: (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`,
};

export default colors;
