export interface Trait {
  icon: string;
  iconFamily: 'Ionicons' | 'Feather' | 'MaterialCommunityIcons';
  label: string;
}

export interface Topic {
  icon: string;
  iconFamily: 'Ionicons' | 'Feather' | 'MaterialCommunityIcons';
  label: string;
}

export interface MentorData {
  id: string;
  name: string;
  tagline: string;
  profileImage: any;
  audioTitle: string;
  audioDuration: string;
  sharedTraits: Trait[];
  workingOn: string;
  topics: Topic[];
  advice: string;
  currentlyListening: {
    song: string;
    artist: string;
    albumArt: string;
  };
  whatsUp: string;
  weekendDescription: string;
  weekendImage: string;
}

export const MENTOR_DATA: MentorData = {
  id: 'sam-01',
  name: 'Sam',
  tagline: "We think you'll really click.",
  profileImage: require('../assets/images/sam-profile.png'),
  audioTitle: 'Why I became a mentor...',
  audioDuration: '0:45',
  sharedTraits: [
    {
      icon: 'moon',
      iconFamily: 'Ionicons',
      label: 'Are night owls',
    },
    {
      icon: 'leaf-outline',
      iconFamily: 'Ionicons',
      label: 'Value being in nature',
    },
    {
      icon: 'musical-notes-outline',
      iconFamily: 'Ionicons',
      label: 'Find comfort in music',
    },
    {
      icon: 'people-outline',
      iconFamily: 'Ionicons',
      label: 'Know what it feels like when family life is complicated',
    },
  ],
  workingOn:
    'Figuring out who I am, managing anxiety, and learning how to ask for help when I need it.',
  topics: [
    { icon: 'camera-outline', iconFamily: 'Ionicons', label: 'Photography' },
    { icon: 'football-outline', iconFamily: 'Ionicons', label: 'Sports' },
    { icon: 'restaurant-outline', iconFamily: 'Ionicons', label: 'I love food / cooking' },
    { icon: 'musical-note-outline', iconFamily: 'Ionicons', label: 'Music' },
  ],
  advice:
    "You don't have to look a certain way to be worthy. You already are.",
  currentlyListening: {
    song: 'I Love You, I\'m Sorry',
    artist: 'Gracie Abrams',
    albumArt: 'https://picsum.photos/seed/gracie/80/80',
  },
  whatsUp:
    'Currently in grad school, studying Psychology, trying to be a grown-up but feel like a kid!',
  weekendDescription:
    "There's a trail that I absolutely love near my home!",
  weekendImage: 'https://picsum.photos/seed/trail/400/300',
};
