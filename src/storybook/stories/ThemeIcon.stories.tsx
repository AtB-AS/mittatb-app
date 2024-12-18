import {Meta} from '@storybook/react';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {View} from 'react-native';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {
  Add,
  Adjust,
  ArrowsCounterClockwise,
  Chat,
  Clear,
  Close,
  Confirm,
  Context,
  Delete,
  DragHandle,
  Edit,
  Feedback,
  FeedbackCopy,
  Filter,
  Interchange,
  Reorder,
  Search,
  SortAscending,
  SortDescending,
  Subtract,
  Support,
  Swap,
} from '@atb/assets/svg/mono-icons/actions';
import {
  Laptop,
  Phone as PhoneDevices,
} from '@atb/assets/svg/mono-icons/devices';
import {Logo} from '@atb/assets/svg/mono-icons/logo';
import {
  Map,
  MapPin,
  Pin,
  PinInvalid,
  PinValid,
} from '@atb/assets/svg/mono-icons/map';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowUpLeft,
  BusLiveArrow,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  ExternalLink,
  UnfoldLess,
  UnfoldMore,
} from '@atb/assets/svg/mono-icons/navigation';
import {
  City,
  Destination,
  Favorite,
  FavoriteDisable,
  FavoriteFill,
  FavoriteSemi,
  House,
  Location,
  Parking,
  Stop,
  StopDestination,
  StopOrigin,
} from '@atb/assets/svg/mono-icons/places';
import {
  LogIn,
  LogOut,
  Mail,
  Phone as PhoneProfile,
  User,
} from '@atb/assets/svg/mono-icons/profile';
import {
  Check,
  Error,
  Info,
  ServiceDisruption,
  Spinner,
  Unknown as UnknownStatus,
  Warning,
} from '@atb/assets/svg/mono-icons/status';
import {
  Assistant,
  Departures,
  Profile,
  Ticketing,
} from '@atb/assets/svg/mono-icons/tab-bar';
import {
  Card,
  H24,
  Moon,
  Qr,
  Receipt,
  Sun,
  Ticket,
  TicketAdd,
  TicketInvalid,
  TicketMultiple,
  TicketValid,
  Travelcard,
  TravelcardOutlined,
  Travellers,
  Vipps,
  Youth,
} from '@atb/assets/svg/mono-icons/ticketing';
import {
  Date,
  Duration,
  Realtime,
  RealtimeSmall,
  Time,
} from '@atb/assets/svg/mono-icons/time';
import {
  Boat,
  Bus,
  Ferry,
  Train,
  Tram,
  Car,
  Flexible,
  Unknown as UnknownTransportation,
  Walk,
} from '@atb/assets/svg/mono-icons/transportation';
import {
  Bicycle as BicycleEntur,
  Bus as BusEntur,
  Cableway as CablewayEntur,
  Car as CarEntur,
  Carferry as CarferryEntur,
  Ferry as FerryEntur,
  Funicular as FunicularEntur,
  Helicopter as HelicopterEntur,
  Plane as PlaneEntur,
  Scooter as ScooterEntur,
  Subway as SubwayEntur,
  Taxi as TaxiEntur,
  Train as TrainEntur,
  Tram as TramEntur,
  Walk as WalkEntur,
} from '@atb/assets/svg/mono-icons/transportation-entur';
import {Battery, Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {getColorByOption} from '../utils';

type ThemeIconMetaProps = ThemedStoryProps<ThemeIconProps>;
type IconSize = ThemeIconProps['size'];

const ThemeIconMeta: Meta<ThemeIconMetaProps> = {
  title: 'ThemeIcon',
  component: ThemeIcon,
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'small', 'xSmall'] as IconSize[],
    },
    notification: {
      control: 'select',
      options: [
        'error',
        'warning',
        'valid',
        'error with border',
        'warning with border',
        'valid with border',
      ],
      mapping: {
        error: {color: 'error'},
        warning: {color: 'warning'},
        valid: {color: 'valid'},
        'error with border': {color: 'error', backgroundColor: 'background_0'},
        'warning with border': {
          color: 'warning',
          backgroundColor: 'background_0',
        },
        'valid with border': {color: 'valid', backgroundColor: 'background_0'},
      },
    },
    svg: {
      control: 'select',
      options: [
        'Add',
        'Adjust',
        'ArrowsCounterClockwise',
        'Chat',
        'Clear',
        'Close',
        'Confirm',
        'Context',
        'Delete',
        'DragHandle',
        'Edit',
        'Feedback',
        'FeedbackCopy',
        'Filter',
        'Interchange',
        'Reorder',
        'Search',
        'SortAscending',
        'SortDescending',
        'Subtract',
        'Support',
        'Swap',
        'Laptop',
        'Phone (Devices)',
        'Logo',
        'Map',
        'MapPin',
        'Pin',
        'PinInvalid',
        'PinValid',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUpDown',
        'ArrowUpLeft',
        'BusLiveArrow',
        'ChevronLeft',
        'ChevronRight',
        'ExpandLess',
        'ExpandMore',
        'ExternalLink',
        'UnfoldLess',
        'UnfoldMore',
        'City',
        'Destination',
        'Favorite',
        'FavoriteDisable',
        'FavoriteFill',
        'FavoriteSemi',
        'House',
        'Location',
        'Parking',
        'Stop',
        'StopDestination',
        'StopOrigin',
        'LogIn',
        'LogOut',
        'Mail',
        'Phone (Profile)',
        'User',
        'Check',
        'Error',
        'Info',
        'ServiceDisruption',
        'Spinner',
        'Unknown (Status)',
        'Warning',
        'Assistant',
        'Departures',
        'Profile',
        'Ticketing',
        'Card',
        'H24',
        'Moon',
        'Qr',
        'Receipt',
        'Sun',
        'Ticket',
        'TicketAdd',
        'TicketInvalid',
        'TicketMultiple',
        'TicketValid',
        'Travelcard',
        'TravelcardOutlined',
        'Travellers',
        'Vipps',
        'Youth',
        'Date',
        'Duration',
        'Realtime',
        'RealtimeSmall',
        'Time',
        'Boat',
        'Bus',
        'Ferry',
        'Metro',
        'Train',
        'Tram',
        'Car',
        'Flexible',
        'Unknown (Transportation)',
        'Walk',
        'Bicycle (Entur)',
        'Bus (Entur)',
        'Cableway (Entur)',
        'Car (Entur)',
        'Carferry (Entur)',
        'Ferry (Entur)',
        'Funicular (Entur)',
        'Helicopter (Entur)',
        'Plane (Entur)',
        'Scooter (Entur)',
        'Subway (Entur)',
        'Taxi (Entur)',
        'Train (Entur)',
        'Tram (Entur)',
        'Walk (Entur)',
        'Battery',
        'Bicycle',
      ],
      mapping: {
        Add: Add,
        Adjust: Adjust,
        ArrowsCounterClockwise: ArrowsCounterClockwise,
        Chat: Chat,
        Clear: Clear,
        Close: Close,
        Confirm: Confirm,
        Context: Context,
        Delete: Delete,
        DragHandle: DragHandle,
        Edit: Edit,
        Feedback: Feedback,
        FeedbackCopy: FeedbackCopy,
        Filter: Filter,
        Interchange: Interchange,
        Reorder: Reorder,
        Search: Search,
        SortAscending: SortAscending,
        SortDescending: SortDescending,
        Subtract: Subtract,
        Support: Support,
        Swap: Swap,
        Laptop: Laptop,
        'Phone (Devices)': PhoneDevices,
        Logo: Logo,
        Map: Map,
        MapPin: MapPin,
        Pin: Pin,
        PinInvalid: PinInvalid,
        PinValid: PinValid,
        ArrowLeft: ArrowLeft,
        ArrowRight: ArrowRight,
        ArrowUpDown: ArrowUpDown,
        ArrowUpLeft: ArrowUpLeft,
        BusLiveArrow: BusLiveArrow,
        ChevronLeft: ChevronLeft,
        ChevronRight: ChevronRight,
        ExpandLess: ExpandLess,
        ExpandMore: ExpandMore,
        ExternalLink: ExternalLink,
        UnfoldLess: UnfoldLess,
        UnfoldMore: UnfoldMore,
        City: City,
        Destination: Destination,
        Favorite: Favorite,
        FavoriteDisable: FavoriteDisable,
        FavoriteFill: FavoriteFill,
        FavoriteSemi: FavoriteSemi,
        House: House,
        Location: Location,
        Parking: Parking,
        Stop: Stop,
        StopDestination: StopDestination,
        StopOrigin: StopOrigin,
        LogIn: LogIn,
        LogOut: LogOut,
        Mail: Mail,
        'Phone (Profile)': PhoneProfile,
        User: User,
        Check: Check,
        Error: Error,
        Info: Info,
        ServiceDisruption: ServiceDisruption,
        Spinner: Spinner,
        'Unknown (Status)': UnknownStatus,
        Warning: Warning,
        Assistant: Assistant,
        Departures: Departures,
        Profile: Profile,
        Ticketing: Ticketing,
        Card: Card,
        H24: H24,
        Moon: Moon,
        Qr: Qr,
        Receipt: Receipt,
        Sun: Sun,
        Ticket: Ticket,
        TicketAdd: TicketAdd,
        TicketInvalid: TicketInvalid,
        TicketMultiple: TicketMultiple,
        TicketValid: TicketValid,
        Travelcard: Travelcard,
        TravelcardOutlined: TravelcardOutlined,
        Travellers: Travellers,
        Vipps: Vipps,
        Youth: Youth,
        Date: Date,
        Duration: Duration,
        Realtime: Realtime,
        RealtimeSmall: RealtimeSmall,
        Time: Time,
        Boat: Boat,
        Bus: Bus,
        Ferry: Ferry,
        Train: Train,
        Tram: Tram,
        Car: Car,
        Flexible: Flexible,
        'Unknown (Transportation)': UnknownTransportation,
        Walk: Walk,
        'Bicycle (Entur)': BicycleEntur,
        'Bus (Entur)': BusEntur,
        'Cableway (Entur)': CablewayEntur,
        'Car (Entur)': CarEntur,
        'Carferry (Entur)': CarferryEntur,
        'Ferry (Entur)': FerryEntur,
        'Funicular (Entur)': FunicularEntur,
        'Helicopter (Entur)': HelicopterEntur,
        'Plane (Entur)': PlaneEntur,
        'Scooter (Entur)': ScooterEntur,
        'Subway (Entur)': SubwayEntur,
        'Taxi (Entur)': TaxiEntur,
        'Train (Entur)': TrainEntur,
        'Tram (Entur)': TramEntur,
        'Walk (Entur)': WalkEntur,
        Battery: Battery,
        Bicycle: Bicycle,
      },
    },
    ...themedStoryControls,
  },
  args: {
    svg: 'Logo' as any, // Casting to any, since mapping is not typed
    size: 'large',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View style={{alignItems: 'center'}}>
        <Story
          args={{...args, color: getColorByOption(args.theme, args.storyColor)}}
        />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default ThemeIconMeta;

export const Basic: Record<string, unknown> = {};
