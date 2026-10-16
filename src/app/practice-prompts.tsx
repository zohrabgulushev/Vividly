import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Platform, TextInput, Modal } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export interface PracticePrompt {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  category: 'Business' | 'Travel' | 'Casual' | 'Debate';
  color: string;
  level: string;
  duration: string;
  scenario: string;
  keyVocabulary: Array<{ phrase: string; meaning: string }>;
  dialogue: Array<{ speaker: string; text: string }>;
  questions: string[];
}

const TOPICS_DATA: PracticePrompt[] = [
  {
    id: 1,
    icon: '💻',
    title: 'Tech Job Interview',
    subtitle: 'Business • Advanced',
    category: 'Business',
    color: '#dbe1ff',
    level: 'Advanced (C1)',
    duration: '15-20 Mins',
    scenario: 'You are interviewing for a Senior Software Engineer position at an international technology firm. Explain your architectural decisions and past project successes.',
    keyVocabulary: [
      { phrase: 'Scalability bottleneck', meaning: 'Point where a system slows down under high load' },
      { phrase: 'Cross-functional alignment', meaning: 'Coordinating between engineering, product, and design' },
      { phrase: 'Graceful degradation', meaning: 'System keeps functioning even when parts fail' },
      { phrase: 'Key deliverables', meaning: 'Major outputs or milestones expected from a project' },
    ],
    dialogue: [
      { speaker: 'Interviewer', text: 'Could you walk me through a challenging architectural problem you recently solved?' },
      { speaker: 'You', text: 'Certainly. In our previous microservice migration, we observed high latency due to unindexed database queries and unoptimized network requests.' },
      { speaker: 'Interviewer', text: 'Interesting. How did you align the engineering team around the new caching strategy?' },
      { speaker: 'You', text: 'I conducted benchmark demonstrations and established automated latency guardrails in our CI/CD pipeline.' },
    ],
    questions: [
      'What are your primary strategies for resolving technical debt?',
      'How do you manage conflicting priorities between speed and stability?',
      'Describe a time when you received tough technical feedback.',
    ],
  },
  {
    id: 2,
    icon: '☕',
    title: 'Ordering at a Cafe',
    subtitle: 'Casual • Beginner',
    category: 'Casual',
    color: '#fed7aa',
    level: 'Beginner (A1-A2)',
    duration: '5-10 Mins',
    scenario: 'You are visiting an artisan coffee shop in central London. Practice ordering drinks with custom milk options, asking for pastry recommendations, and requesting the WiFi code.',
    keyVocabulary: [
      { phrase: 'For here or to go?', meaning: 'Drinking inside the cafe or taking away' },
      { phrase: 'Oat milk substitute', meaning: 'Plant-based dairy alternative' },
      { phrase: 'Keep the change', meaning: 'Tip the barista with remaining coins' },
      { phrase: 'Contactless payment', meaning: 'Paying with phone or tap card' },
    ],
    dialogue: [
      { speaker: 'Barista', text: 'Hi there! What can I get started for you today?' },
      { speaker: 'You', text: 'Hello! Could I please get a flat white with oat milk, and a warm croissant?' },
      { speaker: 'Barista', text: 'Sure thing. For here or to go?' },
      { speaker: 'You', text: 'For here, please. And what is the WiFi password?' },
    ],
    questions: [
      'What is your go-to morning hot drink and breakfast pastry?',
      'How do you politely decline an item if the cafe is out of stock?',
    ],
  },
  {
    id: 3,
    icon: '💼',
    title: 'Small Talk at Work',
    subtitle: 'Business • Intermediate',
    category: 'Business',
    color: '#dbe1ff',
    level: 'Intermediate (B1-B2)',
    duration: '10 Mins',
    scenario: 'You bump into a colleague from another department in the breakroom before the quarterly all-hands meeting. Build rapport and exchange updates.',
    keyVocabulary: [
      { phrase: 'Keeping busy', meaning: 'Working productively on active tasks' },
      { phrase: 'Wrap up the quarter', meaning: 'Finish deliverables before end of period' },
      { phrase: 'Catch up later', meaning: 'Talk more at an upcoming convenient time' },
    ],
    dialogue: [
      { speaker: 'Colleague', text: 'Hey! How has your week been shaping up?' },
      { speaker: 'You', text: 'Pretty busy wrapping up the new release, but really excited about the launch! How about your team?' },
      { speaker: 'Colleague', text: 'We just finalized next quarter budget. Grab lunch together sometime next week?' },
      { speaker: 'You', text: 'Sounds great, I will send you a calendar invite!' },
    ],
    questions: [
      'What are easy conversation starters on Monday mornings?',
      'How do you transition smoothly from casual small talk back to work?',
    ],
  },
  {
    id: 4,
    icon: '✈️',
    title: 'Airport & Customs Check',
    subtitle: 'Travel • Intermediate',
    category: 'Travel',
    color: '#caead6',
    level: 'Intermediate (B1)',
    duration: '10-15 Mins',
    scenario: 'You just arrived at international passport control. Answer the border officer questions regarding the purpose of your trip, duration of stay, and accommodation details.',
    keyVocabulary: [
      { phrase: 'Purpose of visit', meaning: 'Reason for travelling (tourism, business)' },
      { phrase: 'Proof of accommodation', meaning: 'Hotel booking or address confirmation' },
      { phrase: 'Return flight itinerary', meaning: 'Scheduled ticket back home' },
    ],
    dialogue: [
      { speaker: 'Immigration Officer', text: 'Good evening. Passport and boarding pass, please. What is the purpose of your visit?' },
      { speaker: 'You', text: 'Good evening. I am here for tourism and attending a design conference for 10 days.' },
      { speaker: 'Immigration Officer', text: 'Where will you be staying during your stay?' },
      { speaker: 'You', text: 'Here is my hotel confirmation at the Central Park Hotel.' },
    ],
    questions: [
      'What documents should you always keep handy when travelling abroad?',
      'How do you ask for assistance if your luggage is delayed?',
    ],
  },
  {
    id: 5,
    icon: '🌍',
    title: 'Cultural Nuances & Etiquette',
    subtitle: 'Travel • Advanced',
    category: 'Travel',
    color: '#caead6',
    level: 'Advanced (C1)',
    duration: '15 Mins',
    scenario: 'You are invited to a formal dinner with international colleagues. Discuss local dining traditions, tipping customs, and respectful social norms.',
    keyVocabulary: [
      { phrase: 'Faux pas', meaning: 'An embarrassing social blunder or mistake' },
      { phrase: 'Tipping etiquette', meaning: 'Norms regarding gratuity in restaurants' },
      { phrase: 'Mutual deference', meaning: 'Showing mutual respect and courtesy' },
    ],
    dialogue: [
      { speaker: 'Host', text: 'Welcome! We are honored to have you join our annual appreciation dinner tonight.' },
      { speaker: 'You', text: 'Thank you so much for the gracious invitation. The hospitality has been outstanding.' },
      { speaker: 'Host', text: 'Please feel free to sample the local specialties and let us know your favorites.' },
      { speaker: 'You', text: 'I am eager to try the regional dishes and learn more about their history.' },
    ],
    questions: [
      'How do tipping standards vary between North America and Europe?',
      'What are some respectful ways to navigate dietary restrictions at dinner?',
    ],
  },
  {
    id: 6,
    icon: '🌱',
    title: 'Debate: Climate & Energy',
    subtitle: 'Debate • Expert',
    category: 'Debate',
    color: '#ffdad6',
    level: 'Mastery (C2)',
    duration: '20 Mins',
    scenario: 'Engage in a structured panel debate regarding the transition to renewable energy sources, balancing carbon reduction goals with industrial supply chain stability.',
    keyVocabulary: [
      { phrase: 'Net-zero transition', meaning: 'Reaching balance between greenhouse gas emissions and removals' },
      { phrase: 'Grid infrastructure', meaning: 'The electrical network transmitting power across regions' },
      { phrase: 'Subsidies and tariffs', meaning: 'Government economic incentives and trade taxes' },
    ],
    dialogue: [
      { speaker: 'Moderator', text: 'Let us examine whether rapid fossil fuel phase-outs risk grid stability.' },
      { speaker: 'You', text: 'While transition speed is critical, grid storage capacity must scale proportionally to prevent base-load disruptions.' },
      { speaker: 'Opponent', text: 'Delaying strict phase-out targets only prolongs climate externalities.' },
      { speaker: 'You', text: 'Targeted capital investment into battery density and geothermal energy resolves both concerns simultaneously.' },
    ],
    questions: [
      'What economic mechanisms best incentivize corporate carbon reduction?',
      'How can developing economies balance industrial growth with environmental standards?',
    ],
  },
  {
    id: 7,
    icon: '🤖',
    title: 'Debate: AI & The Future of Work',
    subtitle: 'Debate • Expert',
    category: 'Debate',
    color: '#ffdad6',
    level: 'Mastery (C2)',
    duration: '20 Mins',
    scenario: 'Take a stance on how generative artificial intelligence and autonomous systems will reshape the global labor market over the next decade.',
    keyVocabulary: [
      { phrase: 'Workforce displacement', meaning: 'Workers losing roles due to technological changes' },
      { phrase: 'Cognitive augmentation', meaning: 'Enhancing human intelligence using AI tools' },
      { phrase: 'Reskilling initiatives', meaning: 'Programs teaching workers new relevant skill sets' },
    ],
    dialogue: [
      { speaker: 'Moderator', text: 'Does AI threaten knowledge workers more than previous industrial revolutions?' },
      { speaker: 'You', text: 'Historical precedent suggests automation shifts employment into higher-order orchestration rather than total eradication.' },
      { speaker: 'Opponent', text: 'The velocity of this transition is unprecedented, leaving inadequate time for societal adaptation.' },
      { speaker: 'You', text: 'That underscores why aggressive institutional reskilling must accompany deployment.' },
    ],
    questions: [
      'Which professional skills will remain uniquely human?',
      'Should companies provide severance and retraining for automated roles?',
    ],
  },
  {
    id: 8,
    icon: '🏨',
    title: 'Hotel Check-In & Requests',
    subtitle: 'Travel • Beginner',
    category: 'Travel',
    color: '#caead6',
    level: 'Beginner (A2)',
    duration: '10 Mins',
    scenario: 'You are checking into your boutique hotel in Barcelona. Request a quiet room on a higher floor, confirm breakfast times, and store luggage before check-in time.',
    keyVocabulary: [
      { phrase: 'Early check-in', meaning: 'Entering your room before the standard check-in hour' },
      { phrase: 'Complimentary breakfast', meaning: 'Free morning meal included with the room' },
      { phrase: 'Luggage holding service', meaning: 'Secure room where bags are stored temporarily' },
    ],
    dialogue: [
      { speaker: 'Concierge', text: 'Welcome to Hotel Arts! How can I assist you today?' },
      { speaker: 'You', text: 'Hello! I have a reservation under the name Alex. Is it possible to check in early?' },
      { speaker: 'Concierge', text: 'Your room is being prepared right now. You are welcome to leave your bags with us and enjoy a complimentary tea in the lounge.' },
      { speaker: 'You', text: 'That sounds perfect, thank you so much.' },
    ],
    questions: [
      'How do you politely report a noisy neighbor or broken air conditioner?',
      'What phrases do you use to ask for late checkout?',
    ],
  },
];

export default function PracticePromptsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PracticePrompt | null>(null);

  const filters = ['All', 'Business', 'Travel', 'Casual', 'Debate'];

  // Filter topics dynamically by category and search text
  const filteredTopics = TOPICS_DATA.filter((topic) => {
    const matchesFilter = activeFilter === 'All' || topic.category.toLowerCase() === activeFilter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query === '' ||
      topic.title.toLowerCase().includes(query) ||
      topic.subtitle.toLowerCase().includes(query) ||
      topic.scenario.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const featuredPrompt = TOPICS_DATA[0]; // Tech Job Interview

  const handleStartWithTutor = (prompt: PracticePrompt) => {
    setSelectedPrompt(null);
    router.push({
      pathname: '/book-session',
      params: { tutorName: 'Dr. Aris Thorne', tutorId: 'tutor-aris', callType: 'private' }
    });
  };

  const handleStartActiveCall = (prompt: PracticePrompt) => {
    setSelectedPrompt(null);
    router.push({
      pathname: '/active-call',
      params: { tutorName: prompt.title, tutorId: 'topic-' + prompt.id, callType: 'private' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/speak')} 
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#003594" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversation Topics</Text>
        <TouchableOpacity 
          onPress={() => setIsSearchVisible(v => !v)} 
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name={isSearchVisible ? 'close' : 'search'} size={24} color="#003594" />
        </TouchableOpacity>
      </View>

      {/* Expandable Search Input */}
      {isSearchVisible && (
        <View style={styles.searchBarContainer}>
          <Feather name="search" size={18} color="#737686" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics by keyword (e.g. cafe, interview, debate)..."
            placeholderTextColor="#737686"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <MaterialIcons name="clear" size={18} color="#737686" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Featured Hero Card */}
        <View style={styles.heroContainer}>
          <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7RxW7IucjTR1Jj7WPoFFR4iiFdc0tcLjF5TJLQfeq4oK58UEX3RT-bH4Gmke16l3ZFNKDHrfGEL8bC3vxZ8bDoSaIBFUd_9u8cbtiWTYEx5JlihERhXH98YOkVFSoprEM5ZyLz3-H2SUQ0HzalImGAmw1lmUfwZQb4iM7v15XVFZOtt_sVZVv2GbXDMholGe_EyqWc37g3qk7o640SjZIgb7Mcrx2EY518N1XVKJXiunTCeRxu9de1Z1yksQk4xrUdJPX0p8fB5Cb' }}
            style={styles.heroImage}
            imageStyle={{ opacity: 0.8 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0, 74, 198, 0.92)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroBadges}>
                <View style={styles.badgeSolid}>
                  <Text style={styles.badgeSolidText}>FEATURED • ADVANCED</Text>
                </View>
                <View style={styles.badgeGlass}>
                  <Text style={styles.badgeGlassText}>{featuredPrompt.duration}</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>{featuredPrompt.title}</Text>
              <Text style={styles.heroSubtitle}>{featuredPrompt.scenario}</Text>
            </View>
            <TouchableOpacity 
              style={styles.playButton} 
              activeOpacity={0.85}
              onPress={() => setSelectedPrompt(featuredPrompt)}
            >
              <MaterialIcons name="play-arrow" size={32} color="#004ac6" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {filters.map((filter, index) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>
            {activeFilter === 'All' ? 'All Practice Prompts' : `${activeFilter} Topics`}
          </Text>
          <Text style={styles.sectionCount}>{filteredTopics.length} available</Text>
        </View>

        {/* Topics List */}
        <View style={styles.topicsList}>
          {filteredTopics.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={48} color="#c3c6d6" />
              <Text style={styles.emptyTitle}>No matching prompts</Text>
              <Text style={styles.emptySubtitle}>Try changing your filter or search keywords.</Text>
            </View>
          ) : (
            filteredTopics.map((topic) => (
              <TouchableOpacity 
                key={topic.id} 
                style={styles.topicCard} 
                activeOpacity={0.7}
                onPress={() => setSelectedPrompt(topic)}
              >
                <View style={[styles.topicIconContainer, { backgroundColor: topic.color }]}>
                  <Text style={styles.topicIcon}>{topic.icon}</Text>
                </View>
                <View style={styles.topicInfo}>
                  <View style={styles.topicTitleRow}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <View style={styles.miniBadge}>
                      <Text style={styles.miniBadgeText}>{topic.duration}</Text>
                    </View>
                  </View>
                  <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
                  <Text style={styles.topicSnippet} numberOfLines={2}>{topic.scenario}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#004ac6" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>

      {/* Interactive Prompt Practice Modal */}
      {selectedPrompt && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedPrompt(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Text style={styles.modalIcon}>{selectedPrompt.icon}</Text>
                  <View>
                    <Text style={styles.modalTitle}>{selectedPrompt.title}</Text>
                    <Text style={styles.modalMeta}>{selectedPrompt.level} • {selectedPrompt.duration}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => setSelectedPrompt(null)}
                  style={styles.modalCloseBtn}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={24} color="#737686" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                
                {/* Scenario */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>ROLEPLAY SCENARIO</Text>
                  <View style={styles.scenarioCard}>
                    <MaterialIcons name="lightbulb" size={22} color="#004ac6" style={{ marginRight: 10, marginTop: 2 }} />
                    <Text style={styles.scenarioText}>{selectedPrompt.scenario}</Text>
                  </View>
                </View>

                {/* Key Vocabulary */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>ESSENTIAL VOCABULARY & PHRASES</Text>
                  <View style={styles.vocabList}>
                    {selectedPrompt.keyVocabulary.map((item, idx) => (
                      <View key={idx} style={styles.vocabItem}>
                        <View style={styles.vocabBullet} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.vocabPhrase}>{item.phrase}</Text>
                          <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Sample Starter Dialogue */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>SAMPLE DIALOGUE SCRIPT</Text>
                  <View style={styles.dialogueList}>
                    {selectedPrompt.dialogue.map((line, idx) => {
                      const isMe = line.speaker === 'You';
                      return (
                        <View key={idx} style={[styles.dialogueBubble, isMe ? styles.dialogueBubbleMe : styles.dialogueBubbleOther]}>
                          <Text style={[styles.dialogueSpeaker, isMe && { color: '#004ac6' }]}>{line.speaker}</Text>
                          <Text style={styles.dialogueText}>{line.text}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Discussion Questions */}
                <View style={[styles.modalSection, { marginBottom: 24 }]}>
                  <Text style={styles.modalSectionLabel}>PROMPT QUESTIONS TO ANSWER</Text>
                  {selectedPrompt.questions.map((q, idx) => (
                    <View key={idx} style={styles.questionCard}>
                      <Text style={styles.questionNum}>{idx + 1}.</Text>
                      <Text style={styles.questionText}>{q}</Text>
                    </View>
                  ))}
                </View>

              </ScrollView>

              {/* Modal Action Buttons */}
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.modalPrimaryBtn}
                  onPress={() => handleStartActiveCall(selectedPrompt)}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="record-voice-over" size={20} color="#ffffff" />
                  <Text style={styles.modalPrimaryBtnText}>Start Speaking Room</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalSecondaryBtn}
                  onPress={() => handleStartWithTutor(selectedPrompt)}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="school" size={20} color="#004ac6" />
                  <Text style={styles.modalSecondaryBtnText}>Practice with Tutor</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: '#faf8ff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003594',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e8ecf8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#151c27',
  },
  content: {
    paddingBottom: 60,
  },
  heroContainer: {
    height: 320,
    width: '100%',
    backgroundColor: '#004ac6',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    padding: 24,
    zIndex: 10,
    paddingRight: 80,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  badgeSolid: {
    backgroundColor: '#caead6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeSolidText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#042014',
    letterSpacing: 1,
  },
  badgeGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  badgeGlassText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  playButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 20,
  },
  filtersSection: {
    paddingVertical: 18,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#e7e7f2',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#003594',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434654',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151c27',
  },
  sectionCount: {
    fontSize: 13,
    color: '#737686',
    fontWeight: '500',
  },
  topicsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 214, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  topicIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  topicIcon: {
    fontSize: 26,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151c27',
    flex: 1,
    marginRight: 8,
  },
  miniBadge: {
    backgroundColor: 'rgba(0, 74, 198, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#004ac6',
  },
  topicSubtitle: {
    fontSize: 12,
    color: '#737686',
    fontWeight: '600',
    marginBottom: 4,
  },
  topicSnippet: {
    fontSize: 12,
    color: '#434654',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151c27',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#737686',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3ff',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalIcon: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151c27',
  },
  modalMeta: {
    fontSize: 12,
    color: '#737686',
    fontWeight: '500',
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f8',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#004ac6',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scenarioCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe1ff',
  },
  scenarioText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  vocabList: {
    gap: 8,
  },
  vocabItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  vocabBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#004ac6',
    marginTop: 6,
    marginRight: 10,
  },
  vocabPhrase: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  vocabMeaning: {
    fontSize: 12,
    color: '#64748b',
  },
  dialogueList: {
    gap: 8,
  },
  dialogueBubble: {
    padding: 12,
    borderRadius: 14,
    maxWidth: '92%',
  },
  dialogueBubbleMe: {
    backgroundColor: '#e0ebff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  dialogueBubbleOther: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  dialogueSpeaker: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  dialogueText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e8ecf8',
  },
  questionNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#004ac6',
    marginRight: 6,
  },
  questionText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f3ff',
    backgroundColor: '#ffffff',
  },
  modalPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#004ac6',
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  modalPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f4ff',
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#dbe1ff',
  },
  modalSecondaryBtnText: {
    color: '#004ac6',
    fontSize: 15,
    fontWeight: '600',
  },
});
