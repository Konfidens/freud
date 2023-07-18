import { colors } from '../../../stitches/colors';
import { sizes } from '../../../stitches/sizes';
import { LiteralUnion } from '../../../types/literalUnion';
import { hasKey } from '../../../utils/hasKey';

import { iconClassName } from './constants';
import { Archive } from './icons/Archive';
import { ArrowDownSolid } from './icons/ArrowDownSolid';
import { ArrowNarrowLeft } from './icons/ArrowNarrowLeft';
import { ArrowNarrowRight } from './icons/ArrowNarrowRight';
import { ArrowUpSolid } from './icons/ArrowUpSolid';
import { AtSign } from './icons/AtSignIcon';
import { BellSlash } from './icons/BellSlash';
import { Bold } from './icons/BoldIcon';
import { Bolt } from './icons/Bolt';
import { BoltSlash } from './icons/BoltSlash';
import { Book } from './icons/Book';
import { Briefcase } from './icons/Briefcase';
import { Cake } from './icons/Cake';
import { Calendar } from './icons/Calendar';
import { CalendarCancel } from './icons/CalendarCancel';
import { CalendarSolid } from './icons/CalendarSolid';
import { Cash } from './icons/Cash';
import { Chart } from './icons/Chart';
import { Chat } from './icons/Chat';
import { CheckmarkCircle } from './icons/CheckmarkCircle';
import { CheckmarkSolid } from './icons/CheckmarkSolid';
import { CheckmarkSquare } from './icons/CheckmarkSquare';
import { ChevronDoubleLeft } from './icons/ChevronDoubleLeft';
import { ChevronDoubleRight } from './icons/ChevronDoubleRight';
import { ChevronDown } from './icons/ChevronDown';
import { ChevronLeft } from './icons/ChevronLeft';
import { ChevronRight } from './icons/ChevronRight';
import { ChevronUp } from './icons/ChevronUp';
import { ChevronUpDown } from './icons/ChevronUpDown';
import { Clock } from './icons/Clock';
import { Cog } from './icons/Cog';
import { Comment } from './icons/Comment';
import { Copy } from './icons/Copy';
import { CopyDocument } from './icons/CopyDocument';
import { CreditCard } from './icons/CreditCard';
import { DotsHorizontal } from './icons/DotsHorizontal';
import { DotsVertical } from './icons/DotsVertical';
import { Exclamation } from './icons/Exclamation';
import { ExclamationSolid } from './icons/ExclamationSolid';
import { Expand } from './icons/Expand';
import { EyeClosed } from './icons/EyeClosed';
import { EyeOpen } from './icons/EyeOpen';
import { File } from './icons/File';
import { FileDownload } from './icons/FileDownload';
import { FileText } from './icons/FileText';
import { Filter } from './icons/Filter';
import { Gift } from './icons/Gift';
import { Home } from './icons/Home';
import { HomeSolid } from './icons/HomeSolid';
import { Identification } from './icons/Identification';
import { Italic } from './icons/Italic';
import { Lightbulb } from './icons/Lightbulb';
import { Link } from './icons/Link';
import { ListBullet } from './icons/ListBullet';
import { ListNumber } from './icons/ListNumber';
import { LockClosed } from './icons/LockClosed';
import { LockOpen } from './icons/LockOpen';
import { LogIn } from './icons/LogIn';
import { LogOut } from './icons/LogOut';
import { Magnet } from './icons/Magnet';
import { Mail } from './icons/Mail';
import { MapPin } from './icons/MapPin';
import { Night } from './icons/Night';
import { NoSymbol } from './icons/NoSymbol';
import { Office } from './icons/Office';
import { Package } from './icons/Package';
import { Paperclip } from './icons/Paperclip';
import { Pencil } from './icons/Pencil';
import { Phone } from './icons/Phone';
import { Photo } from './icons/Photo';
import { Pin } from './icons/Pin';
import { PlusThick } from './icons/PlusThick';
import { Printer } from './icons/Printer';
import { QuestionMarkMini } from './icons/QuestionMarkMini';
import { QuestionMarkSolid } from './icons/QuestionMarkSolid';
import { Redo } from './icons/Redo';
import { Search } from './icons/Search';
import { SearchEmpty } from './icons/SearchEmpty';
import { Snippet } from './icons/Snippet';
import { Spinner } from './icons/Spinner';
import { Stethoscope } from './icons/Stethoscope';
import { Tag } from './icons/Tag';
import { Tea } from './icons/Tea';
import { Trash } from './icons/Trash';
import { Unarchive } from './icons/Unarchive';
import { Underline } from './icons/Underline';
import { Undo } from './icons/Undo';
import { Upload } from './icons/Upload';
import { User } from './icons/User';
import { Users } from './icons/Users';
import { UsersSolid } from './icons/UsersSolid';
import { VideoCamera } from './icons/VideoCamera';
import { VideoCameraSlash } from './icons/VideoCameraSlash';
import { Wallet } from './icons/Wallet';
import { X } from './icons/X';

export const IconNameValues = {
  archive: 'archive',
  arrowDownSolid: 'arrowDownSolid',
  arrowUpSolid: 'arrowUpSolid',
  arrowNarrowLeft: 'arrowNarrowLeft',
  arrowNarrowRight: 'arrowNarrowRight',
  atSign: 'atSign',
  bellSlash: 'bellSlash',
  bold: 'bold',
  bolt: 'bolt',
  boltSlash: 'boltSlash',
  book: 'book',
  briefcase: 'briefcase',
  cake: 'cake',
  calendar: 'calendar',
  calendarSolid: 'calendarSolid',
  calendarCancel: 'calendarCancel',
  cash: 'cash',
  chart: 'chart',
  chat: 'chat',
  checkmarkCircle: 'checkmarkCircle',
  checkmarkSolid: 'checkmarkSolid',
  checkmarkSquare: 'checkmarkSquare',
  chevronDoubleLeft: 'chevronDoubleLeft',
  chevronDoubleRight: 'chevronDoubleRight',
  chevronDown: 'chevronDown',
  chevronLeft: 'chevronLeft',
  chevronRight: 'chevronRight',
  chevronUp: 'chevronUp',
  chevronUpDown: 'chevronUpDown',
  clock: 'clock',
  cog: 'cog',
  comment: 'comment',
  copy: 'copy',
  copyDocument: 'copyDocument',
  creditCard: 'creditCard',
  dotsHorizontal: 'dotsHorizontal',
  dotsVertical: 'dotsVertical',
  exclamation: 'exclamation',
  exclamationSolid: 'exclamationSolid',
  expand: 'expand',
  eyeClosed: 'eyeClosed',
  eyeOpen: 'eyeOpen',
  file: 'file',
  fileDownload: 'fileDownload',
  fileText: 'fileText',
  filter: 'filter',
  gift: 'gift',
  home: 'home',
  homeSolid: 'homeSolid',
  identification: 'identification',
  italic: 'italic',
  lightbulb: 'lightbulb',
  link: 'link',
  listBullet: 'listBullet',
  listNumber: 'listNumber',
  lockClosed: 'lockClosed',
  lockOpen: 'lockOpen',
  logIn: 'logIn',
  logOut: 'logOut',
  magnet: 'magnet',
  mail: 'mail',
  mapPin: 'mapPin',
  night: 'night',
  noSymbol: 'noSymbol',
  office: 'office',
  package: 'package',
  paperclip: 'paperclip',
  pencil: 'pencil',
  phone: 'phone',
  photo: 'photo',
  pin: 'pin',
  plusThick: 'plusThick',
  printer: 'printer',
  questionMarkMini: 'questionMarkMini',
  questionMarkSolid: 'questionMarkSolid',
  redo: 'redo',
  search: 'search',
  searchEmpty: 'searchEmpty',
  snippet: 'snippet',
  spinner: 'spinner',
  stethoscope: 'stethoscope',
  tag: 'tag',
  tea: 'tea',
  trash: 'trash',
  unarchive: 'unarchive',
  underline: 'underline',
  undo: 'undo',
  upload: 'upload',
  user: 'user',
  users: 'users',
  usersSolid: 'usersSolid',
  videoCamera: 'videoCamera',
  videoCameraSlash: 'videoCameraSlash',
  wallet: 'wallet',
  x: 'x',
} as const;

export type IconName = typeof IconNameValues[keyof typeof IconNameValues];
export type IconColor = LiteralUnion<keyof typeof colors, string>;
export type IconSize = LiteralUnion<keyof typeof sizes, string>;

type Props = {
  name: IconName;
  color?: IconColor;
  size?: IconSize;
  strokeWidth?: number;
};

export const Icon = ({
  name,
  color: rawColor = 'currentColor',
  size: rawSize = '1em',
  strokeWidth,
}: Props) => {
  const color = hasKey(colors, rawColor) ? colors[rawColor] : rawColor;
  const size = hasKey(sizes, rawSize) ? sizes[rawSize] : rawSize;
  const props = { color, size, strokeWidth, className: iconClassName };

  switch (name) {
    case 'archive':
      return <Archive {...props} />;
    case 'arrowDownSolid':
      return <ArrowDownSolid {...props} />;
    case 'arrowUpSolid':
      return <ArrowUpSolid {...props} />;
    case 'arrowNarrowLeft':
      return <ArrowNarrowLeft {...props} />;
    case 'arrowNarrowRight':
      return <ArrowNarrowRight {...props} />;
    case 'atSign':
      return <AtSign {...props} />;
    case 'bellSlash':
      return <BellSlash {...props} />;
    case 'bold':
      return <Bold {...props} />;
    case 'bolt':
      return <Bolt {...props} />;
    case 'boltSlash':
      return <BoltSlash {...props} />;
    case 'book':
      return <Book {...props} />;
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'cake':
      return <Cake {...props} />;
    case 'calendar':
      return <Calendar {...props} />;
    case 'calendarSolid':
      return <CalendarSolid {...props} />;
    case 'calendarCancel':
      return <CalendarCancel {...props} />;
    case 'cash':
      return <Cash {...props} />;
    case 'chart':
      return <Chart {...props} />;
    case 'chat':
      return <Chat {...props} />;
    case 'checkmarkSolid':
      return <CheckmarkSolid {...props} />;
    case 'checkmarkCircle':
      return <CheckmarkCircle {...props} />;
    case 'checkmarkSquare':
      return <CheckmarkSquare {...props} />;
    case 'chevronDoubleLeft':
      return <ChevronDoubleLeft {...props} />;
    case 'chevronDoubleRight':
      return <ChevronDoubleRight {...props} />;
    case 'chevronDown':
      return <ChevronDown {...props} />;
    case 'chevronUp':
      return <ChevronUp {...props} />;
    case 'chevronUpDown':
      return <ChevronUpDown {...props} />;
    case 'chevronLeft':
      return <ChevronLeft {...props} />;
    case 'chevronRight':
      return <ChevronRight {...props} />;
    case 'clock':
      return <Clock {...props} />;
    case 'cog':
      return <Cog {...props} />;
    case 'comment':
      return <Comment {...props} />;
    case 'copy':
      return <Copy {...props} />;
    case 'copyDocument':
      return <CopyDocument {...props} />;
    case 'creditCard':
      return <CreditCard {...props} />;
    case 'dotsHorizontal':
      return <DotsHorizontal {...props} />;
    case 'dotsVertical':
      return <DotsVertical {...props} />;
    case 'file':
      return <File {...props} />;
    case 'fileDownload':
      return <FileDownload {...props} />;
    case 'fileText':
      return <FileText {...props} />;
    case 'exclamation':
      return <Exclamation {...props} />;
    case 'exclamationSolid':
      return <ExclamationSolid {...props} />;
    case 'expand':
      return <Expand {...props} />;
    case 'eyeClosed':
      return <EyeClosed {...props} />;
    case 'eyeOpen':
      return <EyeOpen {...props} />;
    case 'filter':
      return <Filter {...props} />;
    case 'gift':
      return <Gift {...props} />;
    case 'home':
      return <Home {...props} />;
    case 'homeSolid':
      return <HomeSolid {...props} />;
    case 'identification':
      return <Identification {...props} />;
    case 'italic':
      return <Italic {...props} />;
    case 'lightbulb':
      return <Lightbulb {...props} />;
    case 'link':
      return <Link {...props} />;
    case 'listBullet':
      return <ListBullet {...props} />;
    case 'listNumber':
      return <ListNumber {...props} />;
    case 'lockClosed':
      return <LockClosed {...props} />;
    case 'lockOpen':
      return <LockOpen {...props} />;
    case 'logIn':
      return <LogIn {...props} />;
    case 'logOut':
      return <LogOut {...props} />;
    case 'magnet':
      return <Magnet {...props} />;
    case 'mail':
      return <Mail {...props} />;
    case 'mapPin':
      return <MapPin {...props} />;
    case 'night':
      return <Night {...props} />;
    case 'noSymbol':
      return <NoSymbol {...props} />;
    case 'pin':
      return <Pin {...props} />;
    case 'office':
      return <Office {...props} />;
    case 'package':
      return <Package {...props} />;
    case 'paperclip':
      return <Paperclip {...props} />;
    case 'pencil':
      return <Pencil {...props} />;
    case 'phone':
      return <Phone {...props} />;
    case 'photo':
      return <Photo {...props} />;
    case 'plusThick':
      return <PlusThick {...props} />;
    case 'printer':
      return <Printer {...props} />;
    case 'questionMarkMini':
      return <QuestionMarkMini {...props} />;
    case 'questionMarkSolid':
      return <QuestionMarkSolid {...props} />;
    case 'redo':
      return <Redo {...props} />;
    case 'search':
      return <Search {...props} />;
    case 'searchEmpty':
      return <SearchEmpty {...props} />;
    case 'snippet':
      return <Snippet {...props} />;
    case 'spinner':
      return <Spinner {...props} />;
    case 'stethoscope':
      return <Stethoscope {...props} />;
    case 'tag':
      return <Tag {...props} />;
    case 'tea':
      return <Tea {...props} />;
    case 'trash':
      return <Trash {...props} />;
    case 'unarchive':
      return <Unarchive {...props} />;
    case 'underline':
      return <Underline {...props} />;
    case 'undo':
      return <Undo {...props} />;
    case 'upload':
      return <Upload {...props} />;
    case 'user':
      return <User {...props} />;
    case 'users':
      return <Users {...props} />;
    case 'usersSolid':
      return <UsersSolid {...props} />;
    case 'videoCamera':
      return <VideoCamera {...props} />;
    case 'videoCameraSlash':
      return <VideoCameraSlash {...props} />;
    case 'wallet':
      return <Wallet {...props} />;
    case 'x':
      return <X {...props} />;
    default:
      throw new Error(`Icon: Invalid icon name ${name}`);
  }
};
