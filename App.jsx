import React, { useState, useEffect } from 'react';
import { ChevronRight, Leaf, Heart, Brain, Zap, Shield, Sun, Moon, Utensils, Dumbbell, BookOpen, Smile, Sparkles, XCircle } from 'lucide-react';

// Custom Message Modal Component
const MessageModal = ({ message, type, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const title = type === 'error' ? 'Error!' : 'Information';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
        <div className={`flex items-center ${bgColor} text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-4`}>
          <XCircle className="mr-2" size={24} />
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};


// Main App component
const App = () => {
  // State for scroll-to-top button visibility
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  // State for generated recipe idea
  const [recipeIdea, setRecipeIdea] = useState('');
  // State for recipe loading status
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  // State for generated wellness insight
  const [wellnessInsight, setWellnessInsight] = useState('');
  // State for wellness insight loading status
  const [loadingWellness, setLoadingWellness] = useState(false);
  // State for BMI calculator inputs
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  // State for quiz
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [wellnessType, setWellnessType] = useState('');
  // State for message modal
  const [messageModal, setMessageModal] = useState({ show: false, message: '', type: '' });

  // New states for Ingredient Swap
  const [ingredientToSwap, setIngredientToSwap] = useState('');
  const [swappedIngredient, setSwappedIngredient] = useState('');
  const [loadingSwap, setLoadingSwap] = useState(false);

  // New states for Mindfulness Moment
  const [mindfulnessPrompt, setMindfulnessPrompt] = useState('');
  const [loadingMindfulness, setLoadingMindfulness] = useState(false);


  // Effect to handle scroll event for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) { // Show button after scrolling 300px
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll animation
    });
  };

  // Function to generate a healthy recipe idea using Serverless Function
  const generateRecipeIdea = async () => {
    setLoadingRecipe(true);
    setRecipeIdea(''); // Clear previous recipe
    try {
      // Call your Netlify Function endpoint
      const response = await fetch('/.netlify/functions/generate-recipe', {
        method: 'POST', // Use POST if your function expects it, or GET if simpler
        headers: { 'Content-Type': 'application/json' },
        // No body needed if the prompt is hardcoded in the function
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recipe from serverless function.');
      }

      const data = await response.json();
      if (data.recipe) {
        setRecipeIdea(data.recipe);
      } else {
        setMessageModal({ show: true, message: "Sorry, I couldn't generate a recipe idea at this moment. Please try again!", type: 'error' });
      }
    } catch (error) {
      console.error("Error generating recipe idea:", error);
      setMessageModal({ show: true, message: `Failed to generate recipe idea: ${error.message}. Please try again.`, type: 'error' });
    } finally {
      setLoadingRecipe(false);
    }
  };

  // Function to generate a daily wellness insight using Serverless Function
  const generateWellnessInsight = async () => {
    setLoadingWellness(true);
    setWellnessInsight(''); // Clear previous insight
    try {
      // Call your Netlify Function endpoint
      const response = await fetch('/.netlify/functions/generate-insight', {
        method: 'POST', // Use POST if your function expects it, or GET if simpler
        headers: { 'Content-Type': 'application/json' },
        // No body needed if the prompt is hardcoded in the function
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch wellness insight from serverless function.');
      }

      const data = await response.json();
      if (data.insight) {
        setWellnessInsight(data.insight);
      } else {
        setMessageModal({ show: true, message: "Sorry, I couldn't generate a wellness insight at this moment. Please try again!", type: 'error' });
      }
    } catch (error) {
      console.error("Error generating wellness insight:", error);
      setMessageModal({ show: true, message: `Failed to generate wellness insight: ${error.message}. Please try again.`, type: 'error' });
    } finally {
      setLoadingWellness(false);
    }
  };

  // Function to generate an ingredient swap using Serverless Function
  const generateIngredientSwap = async () => {
    if (!ingredientToSwap.trim()) {
      setMessageModal({ show: true, message: "Please enter an ingredient to swap.", type: 'error' });
      return;
    }
    setLoadingSwap(true);
    setSwappedIngredient('');
    try {
      const response = await fetch('/.netlify/functions/swap-ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient: ingredientToSwap }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch ingredient swap from serverless function.');
      }

      const data = await response.json();
      if (data.swap) {
        setSwappedIngredient(data.swap);
      } else {
        setMessageModal({ show: true, message: "Sorry, I couldn't find a healthy swap for that ingredient. Please try another!", type: 'error' });
      }
    } catch (error) {
      console.error("Error generating ingredient swap:", error);
      setMessageModal({ show: true, message: `Failed to generate ingredient swap: ${error.message}. Please try again.`, type: 'error' });
    } finally {
      setLoadingSwap(false);
    }
  };

  // Function to generate a mindfulness prompt using Serverless Function
  const generateMindfulnessPrompt = async () => {
    setLoadingMindfulness(true);
    setMindfulnessPrompt('');
    try {
      const response = await fetch('/.netlify/functions/mindfulness-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch mindfulness prompt from serverless function.');
      }

      const data = await response.json();
      if (data.prompt) {
        setMindfulnessPrompt(data.prompt);
      } else {
        setMessageModal({ show: true, message: "Sorry, I couldn't generate a mindfulness moment. Please try again!", type: 'error' });
      }
    } catch (error) {
      console.error("Error generating mindfulness prompt:", error);
      setMessageModal({ show: true, message: `Failed to generate mindfulness moment: ${error.message}. Please try again.`, type: 'error' });
    } finally {
      setLoadingMindfulness(false);
    }
  };


  // Function to calculate BMI
  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setMessageModal({ show: true, message: "Please enter valid positive numbers for weight (kg) and height (cm).", type: 'error' });
      setBmiResult(null);
      return;
    }

    // Assuming weight in kg, height in cm. Convert height to meters.
    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    const roundedBmi = bmi.toFixed(2);

    let category = '';
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
    } else {
      category = 'Obesity';
    }
    setBmiResult({ bmi: roundedBmi, category });
  };

  // Quiz questions and options
  const quizQuestions = [
    {
      question: "How do you typically feel about cooking at home?",
      options: [
        { text: "Love it, I cook most of my meals.", value: "eat_pro" },
        { text: "It's okay, I do it sometimes.", value: "eat_neutral" },
        { text: "I prefer eating out or ready-made meals.", value: "eat_con" },
      ],
    },
    {
      question: "How often do you engage in physical activity?",
      options: [
        { text: "Daily or almost daily.", value: "live_pro" },
        { text: "A few times a week.", value: "live_neutral" },
        { text: "Rarely or never.", value: "live_con" },
      ],
    },
    {
      question: "What's your biggest challenge when trying to be healthy?",
      options: [
        { text: "Finding motivation/consistency.", value: "challenge_motivation" },
        { text: "Time constraints.", value: "challenge_time" },
        { text: "Cost of healthy options.", value: "challenge_cost" },
        { text: "Knowing what to do.", value: "challenge_knowledge" },
      ],
    },
  ];

  // Handle quiz answer selection
  const handleQuizAnswer = (answerValue) => {
    const newAnswers = [...quizAnswers, answerValue];
    setQuizAnswers(newAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // End of quiz, determine wellness type
      determineWellnessType(newAnswers);
    }
  };

  // Determine wellness type based on answers
  const determineWellnessType = (answers) => {
    let eatScore = 0;
    let liveScore = 0;
    let challengeFocus = '';

    answers.forEach(answer => {
      if (answer.startsWith('eat_')) {
        if (answer === 'eat_pro') eatScore += 2;
        else if (answer === 'eat_neutral') eatScore += 1;
      } else if (answer.startsWith('live_')) {
        if (answer === 'live_pro') liveScore += 2;
        else if (answer === 'live_neutral') liveScore += 1;
      } else if (answer.startsWith('challenge_')) {
        challengeFocus = answer.split('_')[1]; // e.g., 'motivation', 'time'
      }
    });

    let type = '';
    if (eatScore >= 3 && liveScore >= 3) {
      type = "Wellness Champion! You're doing great. Keep exploring new ways to optimize your health.";
    } else if (eatScore >= 3) {
      type = `Eat Well Enthusiast! You've got nutrition down. Let's boost your activity and living habits. Focus on overcoming ${challengeFocus || 'your biggest challenge'}.`;
    } else if (liveScore >= 3) {
      type = `Live Well Mover! You're active and mindful. Let's refine your eating habits for even better results. Focus on overcoming ${challengeFocus || 'your biggest challenge'}.`;
    } else {
      type = `Wellness Explorer! You're ready to start your journey. Let's tackle ${challengeFocus || 'your biggest challenge'} first, whether it's eating or living well.`;
    }
    setWellnessType(type);
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setWellnessType('');
  };


  return (
    <div className="font-inter antialiased text-gray-800 bg-gradient-to-br from-green-50 to-blue-50">
      {/* Message Modal */}
      {messageModal.show && (
        <MessageModal
          message={messageModal.message}
          type={messageModal.type}
          onClose={() => setMessageModal({ show: false, message: '', type: '' })}
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Scroll to top"
        >
          <ChevronRight className="transform -rotate-90" size={24} />
        </button>
      )}

      {/* Header Section */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-12 fixed top-0 left-0 z-40">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="#" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors duration-300">
            Eat Better Live Well
          </a>
          <div className="hidden md:flex space-x-6">
            <a href="#benefits" className="text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium">Benefits</a>
            <a href="#challenges" className="text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium">Overcome Challenges</a>
            <a href="#tools" className="text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium">Tools & Tips</a>
            <a href="#cta" className="text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium">Get Started</a>
          </div>
          {/* Mobile Menu Button (Hamburger) - Placeholder for functionality */}
          <button className="md:hidden text-gray-600 hover:text-green-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen bg-cover bg-center text-white pt-16"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080/6EE7B7/ffffff?text=Healthy+Living+Background')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/70 to-blue-700/70 opacity-90"></div>
        <div className="relative z-10 text-center px-6 py-12 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg animate-fade-in-up">
            Transform Your Life: <span className="text-yellow-300">Eat Better, Live Well.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fade-in-up delay-200">
            Unlock Your Full Potential with Simple, Sustainable Habits for a Healthier, Happier You.
          </p>
          <a
            href="#cta"
            className="inline-block bg-yellow-400 text-green-900 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 animate-bounce-in delay-400"
          >
            Start Your Journey Now
          </a>
        </div>
      </section>

      {/* Why It Matters / Problem-Solution Section */}
      <section id="benefits" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Why Prioritize Your Well-being?</h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            In today's fast-paced world, it's easy to neglect our health. But investing in better eating and living habits isn't just about avoiding illness – it's about unlocking a vibrant, energetic, and fulfilling life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Benefit Card 1 */}
            <div className="bg-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center items-center w-16 h-16 bg-green-500 text-white rounded-full mx-auto mb-6">
                <Leaf size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Boost Your Energy & Vitality</h3>
              <p className="text-gray-700">
                Fuel your body with nutrient-rich foods and consistent activity to experience sustained energy throughout your day, leaving fatigue behind.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="bg-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center items-center w-16 h-16 bg-blue-500 text-white rounded-full mx-auto mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Protect Against Chronic Diseases</h3>
              <p className="text-gray-700">
                Significantly reduce your risk of heart disease, diabetes, obesity, and certain cancers through balanced nutrition and an active lifestyle.
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="bg-yellow-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center items-center w-16 h-16 bg-yellow-500 text-white rounded-full mx-auto mb-6">
                <Brain size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enhance Mental Clarity & Mood</h3>
              <p className="text-gray-700">
                Nourish your brain for improved focus, memory, and emotional well-being, reducing stress and anxiety.
              </p>
            </div>

            {/* Benefit Card 4 */}
            <div className="bg-purple-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center items-center w-16 h-16 bg-purple-500 text-white rounded-full mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Strengthen Your Immune System</h3>
              <p className="text-gray-700">
                A well-nourished body is better equipped to fight off infections and illnesses, keeping you resilient year-round.
              </p>
            </div>

            {/* Benefit Card 5 */}
            <div className="bg-red-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center items-center w-16 h-16 bg-red-500 text-white rounded-full mx-auto mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Achieve & Maintain Healthy Weight</h3>
              <p className="text-gray-700">
                Discover sustainable strategies for weight management that leave you feeling satisfied and in control, without restrictive diets.
              </p>
            </div>

            {/* Benefit Card 6 */}
            <div className="bg-indigo-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center items-center w-16 h-16 bg-indigo-500 text-white rounded-full mx-auto mb-6">
                <Smile size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Improve Overall Quality of Life</h3>
              <p className="text-gray-700">
                From better sleep to healthier skin and a more positive outlook, a healthy lifestyle impacts every aspect of your well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Overcoming Common Roadblocks</h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            We understand that starting a healthy journey can feel overwhelming. Many face similar hurdles, but with the right approach and resources, you can overcome them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Challenge Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">"I don't have enough time."</h3>
              <p className="text-gray-700">
                Busy schedules are a reality. We focus on practical tips for meal prepping, quick healthy recipes, and efficient workout routines that fit into your day, not consume it.
              </p>
            </div>

            {/* Challenge Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">"Healthy food is too expensive."</h3>
              <p className="text-gray-700">
                Eating well doesn't have to break the bank. Learn how to shop smart, utilize seasonal produce, and cook budget-friendly meals that are both nutritious and delicious.
              </p>
            </div>

            {/* Challenge Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">"I lack motivation or don't know where to start."</h3>
              <p className="text-gray-700">
                Our resources provide clear, actionable steps and inspiring guidance to help you build momentum and stay consistent, even on challenging days. Small steps lead to big changes!
              </p>
            </div>

            {/* Challenge Card 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">"It's hard to break old habits."</h3>
              <p className="text-gray-700">
                We offer strategies for gradually replacing unhealthy patterns with positive ones. Focus on sustainable changes that become second nature, making healthy living effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Tips Section (Previously Practical Tips, now with tools) */}
      <section id="tools" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Your Path to a Healthier You: Tools & Practical Tips</h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            Here are foundational principles, actionable tips, and interactive tools to guide you on your journey to eating better and living well.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            {/* Eat Well Tips & Recipe Generator */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-10 rounded-xl shadow-2xl text-white">
              <div className="flex items-center mb-6">
                <Utensils size={40} className="mr-4" />
                <h3 className="text-3xl font-bold">Eat Well</h3>
              </div>
              <ul className="space-y-4 text-lg mb-6">
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Balance Your Plate:</strong> Aim for half fruits/vegetables, a quarter whole grains, and a quarter lean protein.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Hydrate Smart:</strong> Drink plenty of water throughout the day. Limit sugary drinks.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Choose Whole Foods:</strong> Prioritize unprocessed foods like fresh produce, whole grains, and lean meats.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Cook at Home:</strong> Gain control over ingredients and portion sizes. Experiment with herbs and spices.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Mindful Eating:</strong> Pay attention to hunger cues, savor your meals, and avoid distractions while eating.</span>
                </li>
              </ul>
              {/* Gemini API Integration: Recipe Idea */}
              <button
                onClick={generateRecipeIdea}
                disabled={loadingRecipe}
                className="inline-flex items-center justify-center bg-yellow-400 text-green-900 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 text-base mb-4"
              >
                {loadingRecipe ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Healthy Recipe Idea ✨
                  </>
                )}
              </button>
              {recipeIdea && (
                <div className="mt-6 p-4 bg-green-700 rounded-lg text-sm leading-relaxed shadow-inner">
                  <h4 className="font-bold text-lg mb-2">Your Recipe Idea:</h4>
                  <p className="whitespace-pre-wrap">{recipeIdea}</p>
                </div>
              )}

              {/* Gemini API Integration: Ingredient Swap */}
              <div className="mt-8 pt-6 border-t border-green-400">
                <h4 className="font-bold text-lg mb-4">✨ Healthy Ingredient Swap</h4>
                <input
                  type="text"
                  value={ingredientToSwap}
                  onChange={(e) => setIngredientToSwap(e.target.value)}
                  placeholder="e.g., White rice, Sugar"
                  className="w-full p-3 rounded-lg text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={generateIngredientSwap}
                  disabled={loadingSwap}
                  className="inline-flex items-center justify-center bg-yellow-400 text-green-900 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 text-base"
                >
                  {loadingSwap ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Swapping...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      Suggest Swap ✨
                    </>
                  )}
                </button>
                {swappedIngredient && (
                  <div className="mt-6 p-4 bg-green-700 rounded-lg text-sm leading-relaxed shadow-inner">
                    <h4 className="font-bold text-lg mb-2">Healthy Swap:</h4>
                    <p className="whitespace-pre-wrap">{swappedIngredient}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Well Tips & Wellness Insight Generator */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-10 rounded-xl shadow-2xl text-white">
              <div className="flex items-center mb-6">
                <Dumbbell size={40} className="mr-4" />
                <h3 className="text-3xl font-bold">Live Well</h3>
              </div>
              <ul className="space-y-4 text-lg mb-6">
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Move Your Body Daily:</strong> Aim for at least 30 minutes of moderate activity most days. Find activities you enjoy!</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Prioritize Quality Sleep:</strong> Get 7-9 hours of restful sleep each night. Establish a consistent sleep schedule.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Manage Stress Effectively:</strong> Practice mindfulness, meditation, or engage in hobbies to reduce stress levels.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Connect & Engage:</strong> Nurture social relationships. Spend time with loved ones and engage in your community.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={20} className="mt-1 mr-2 flex-shrink-0" />
                  <span><strong className="font-semibold">Embrace Lifelong Learning:</strong> Keep your mind active by learning new things, reading, or pursuing new interests.</span>
                </li>
              </ul>
              {/* Gemini API Integration: Wellness Insight */}
              <button
                onClick={generateWellnessInsight}
                disabled={loadingWellness}
                className="inline-flex items-center justify-center bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 text-base mb-4"
              >
                {loadingWellness ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Daily Wellness Insight ✨
                  </>
                )}
              </button>
              {wellnessInsight && (
                <div className="mt-6 p-4 bg-blue-700 rounded-lg text-sm leading-relaxed shadow-inner">
                  <h4 className="font-bold text-lg mb-2">Your Wellness Insight:</h4>
                  <p className="whitespace-pre-wrap">{wellnessInsight}</p>
                </div>
              )}

              {/* Gemini API Integration: Mindfulness Moment */}
              <div className="mt-8 pt-6 border-t border-blue-400">
                <h4 className="font-bold text-lg mb-4">✨ Mindfulness Moment</h4>
                <button
                  onClick={generateMindfulnessPrompt}
                  disabled={loadingMindfulness}
                  className="inline-flex items-center justify-center bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 text-base"
                >
                  {loadingMindfulness ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      Get Mindfulness Prompt ✨
                    </>
                  )}
                </button>
                {mindfulnessPrompt && (
                  <div className="mt-6 p-4 bg-blue-700 rounded-lg text-sm leading-relaxed shadow-inner">
                    <h4 className="font-bold text-lg mb-2">Your Mindfulness Moment:</h4>
                    <p className="whitespace-pre-wrap">{mindfulnessPrompt}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BMI Calculator */}
            <div className="lg:col-span-2 bg-purple-100 p-10 rounded-xl shadow-2xl text-gray-900 mt-12">
              <div className="flex items-center mb-6 justify-center">
                <BookOpen size={40} className="mr-4 text-purple-700" />
                <h3 className="text-3xl font-bold text-purple-700">BMI Calculator</h3>
              </div>
              <p className="text-lg text-gray-700 text-center mb-6">
                Quickly calculate your Body Mass Index (BMI) to get an idea of your weight category.
                (Please use kilograms for weight and centimeters for height).
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
                <div className="w-full md:w-1/2">
                  <label htmlFor="weight" className="block text-gray-700 text-sm font-bold mb-2">
                    Weight (kg):
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 70"
                    aria-label="Weight in kilograms"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="height" className="block text-gray-700 text-sm font-bold mb-2">
                    Height (cm):
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 175"
                    aria-label="Height in centimeters"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={calculateBMI}
                  className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 text-lg"
                >
                  Calculate BMI
                </button>
              </div>
              {bmiResult && (
                <div className="mt-8 p-6 bg-purple-200 rounded-lg shadow-inner text-center">
                  <h4 className="font-bold text-2xl text-purple-800 mb-2">Your BMI: {bmiResult.bmi}</h4>
                  <p className="text-xl text-purple-700">Category: <span className="font-semibold">{bmiResult.category}</span></p>
                  <p className="text-sm text-gray-600 mt-4">
                    Note: BMI is a general indicator and may not be suitable for all individuals. Consult a healthcare professional for personalized advice.
                  </p>
                </div>
              )}
            </div>

            {/* Simple Wellness Quiz */}
            <div className="lg:col-span-2 bg-yellow-100 p-10 rounded-xl shadow-2xl text-gray-900 mt-12">
              <div className="flex items-center mb-6 justify-center">
                <Sparkles size={40} className="mr-4 text-yellow-700" />
                <h3 className="text-3xl font-bold text-yellow-700">Find Your Wellness Type</h3>
              </div>
              <p className="text-lg text-gray-700 text-center mb-6">
                Answer a few quick questions to get a general idea of your current wellness focus!
              </p>

              {!wellnessType ? (
                <div className="quiz-container">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    {quizQuestions[quizStep].question}
                  </h4>
                  <div className="flex flex-col space-y-4 max-w-md mx-auto">
                    {quizQuestions[quizStep].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(option.value)}
                        className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="quiz-result text-center p-6 bg-yellow-200 rounded-lg shadow-inner">
                  <h4 className="font-bold text-2xl text-yellow-800 mb-4">Your Wellness Insight:</h4>
                  <p className="text-xl text-yellow-700 mb-6">{wellnessType}</p>
                  <button
                    onClick={resetQuiz}
                    className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-20 px-6 md:px-12 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
            Ready to Feel Amazing?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Take the first step towards a healthier, happier you. Explore curated resources that can help you eat better and live well, starting today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="https://urlgeni.us/amzn/eat-well"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-yellow-400 text-green-900 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 text-lg"
            >
              <Utensils className="mr-3" size={24} />
              Explore Eat Well Resources
            </a>
            <a
              href="https://urlgeni.us/mind-body"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-purple-400 text-purple-900 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-purple-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 text-lg"
            >
              <Brain className="mr-3" size={24} />
              Harmonize Your Mind & Body
            </a>
            <a
              href="https://urlgeni.us/amzn/live-well"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-blue-700 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 text-lg"
            >
              <Dumbbell className="mr-3" size={24} />
              Discover Live Well Resources
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-12 bg-gray-900 text-gray-300 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="mb-4">&copy; {new Date().getFullYear()} Eat Better Live Well. All rights reserved.</p>
          <p className="text-sm">
            This site contains affiliate links. We may earn a commission on qualifying purchases.
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
