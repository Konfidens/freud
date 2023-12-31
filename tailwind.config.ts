import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      // gray
      gray900: "hsl(210, 43%, 9%)",
      gray800: "hsl(212, 28%, 17%)",
      gray700: "hsl(208, 19%, 27%)",
      gray600: "hsl(205, 14%, 34%)",
      gray500: "hsl(206, 9%, 46%)",
      gray400: "hsl(208, 11%, 65%)",
      gray350: "hsl(204, 12%, 75%)",
      gray300: "hsl(204, 12%, 84%)",
      gray200: "hsl(210, 13%, 91%)",
      gray150: "hsl(204, 15%, 94%)",
      gray100: "hsl(200, 14%, 96%)",
      gray50: "hsl(210, 20%, 98%)",
      gray10: "hsl(180, 20%, 99%)",

      // grayAlpha
      grayA900: "hsla(212, 99%, 4%, 0.94)",
      grayA800: "hsla(212, 81%, 7%, 0.89)",
      grayA700: "hsla(208, 97%, 7%, 0.78)",
      grayA600: "hsla(208, 100%, 7%, 0.70)",
      grayA500: "hsla(208, 100%, 7%, 0.58)",
      grayA400: "hsla(208, 99%, 11%, 0.39)",
      grayA350: "hsla(204, 99%, 11%, 0.28)",
      grayA300: "hsla(204, 100%, 10%, 0.18)",
      grayA200: "hsla(204, 100%, 12%, 0.1)",
      grayA150: "hsla(204, 100%, 13%, 0.08)",
      grayA100: "hsla(204, 100%, 15%, 0.05)",
      grayA50: "hsla(204, 79%, 19%, 0.03)",
      grayA10: "hsla(204, 92%, 19%, 0.01)",

      // green
      green950: "hsl(176, 96%, 5%)",
      green900: "hsl(176, 94%, 8%)",
      green800: "hsl(173, 90%, 11%)",
      green750: "hsl(172, 86%, 14%)",
      green700: "hsl(170, 86%, 17%)",
      green600: "hsl(167, 82%, 21%)",
      green550: "hsl(164, 78%, 26%)",
      green500: "hsl(161, 72%, 31%)",
      green475: "hsl(160, 70%, 34%)",
      green450: "hsl(158, 68%, 36%)",
      green400: "hsl(155, 48%, 45%)",
      green350: "hsl(151, 41%, 55%)",
      green300: "hsl(148, 42%, 64%)",
      green200: "hsl(144, 44%, 74%)",
      green150: "hsl(143, 45%, 81%)",
      green100: "hsl(142, 45%, 85%)",
      green75: "hsl(142, 45%, 89%)",
      green50: "hsl(140, 45%, 92%)",
      green10: "hsl(138, 42%, 97%)",

      // yellow
      yellow900: "hsl(33, 100%, 13%)",
      yellow800: "hsl(35, 100%, 16%)",
      yellow700: "hsl(37, 100%, 20%)",
      yellow600: "hsl(40, 97%, 28%)",
      yellow550: "hsl(43, 91%, 36%)",
      yellow500: "hsl(45, 85%, 44%)",
      yellow450: "hsl(47, 81%, 49%)",
      yellow400: "hsl(44, 78%, 63%)",
      yellow350: "hsl(46, 87%, 66%)",
      yellow300: "hsl(47, 90%, 70%)",
      yellow200: "hsl(49, 93%, 77%)",
      yellow100: "hsl(50, 96%, 82%)",
      yellow50: "hsl(52, 97%, 88%)",
      yellow10: "hsl(52, 100%, 95%)",

      // red
      red900: "hsl(354, 78%, 14%)",
      red800: "hsl(355, 74%, 21%)",
      red700: "hsl(356, 71%, 28%)",
      red600: "hsl(356, 67%, 35%)",
      red550: "hsl(357, 64%, 42%)",
      red500: "hsl(358, 61%, 49%)",
      red400: "hsl(358, 62%, 56%)",
      red350: "hsl(358, 65%, 64%)",
      red300: "hsl(358, 70%, 71%)",
      red200: "hsl(358, 74%, 82%)",
      red100: "hsl(358, 77%, 91%)",
      red50: "hsl(0, 81%, 96%)",
      red10: "hsl(0, 81%, 99%)",

      // beige
      beige900: "hsl(30, 10%, 11%)",
      beige800: "hsl(30, 10%, 17%)",
      beige700: "hsl(30, 10%, 21%)",
      beige600: "hsl(30, 10%, 28%)",
      beige550: "hsl(30, 10%, 37%)",
      beige500: "hsl(30, 10%, 48%)",
      beige400: "hsl(30, 14%, 60%)",
      beige350: "hsl(30, 17%, 69%)",
      beige300: "hsl(30, 20%, 75%)",
      beige200: "hsl(30, 20%, 85%)",
      beige150: "hsl(30, 20%, 90%)",
      beige100: "hsl(30, 20%, 93%)",
      beige50: "hsl(30, 20%, 95%)",
      beige20: "hsl(30, 20%, 97%)",
      beige10: "hsl(30, 20%, 98%)",

      // blue
      blue600: "hsl(214, 82%, 51%)",
      blue400: "hsl(205, 100%, 70%)",

      // aliases
      textHeading: "hsl(176, 94%, 8%)",
      textBody: "hsl(170, 86%, 17%)",
      textMuted: "hsl(161, 72%, 31%)",
    },
  },
  plugins: [],
} satisfies Config;
