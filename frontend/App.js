function App() {
  const { useState, useEffect } = React;

  const [prompt, setPrompt] = useState('');
  const [mainCharacter, setMainCharacter] = useState('');
  const [setting, setSetting] = useState('');
  const [conflict, setConflict] = useState('');
  const [story, setStory] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [storyLength, setStoryLength] = useState('medium');
  const [storyTone, setStoryTone] = useState('neutral');
  const [savedStories, setSavedStories] = useState([]);
  const [showSavedStoriesModal, setShowSavedStoriesModal] = useState(false);

  // IMPORTANT: Update this URL to your deployed Render backend URL after deployment!
  // For local testing, keep it as 'http://localhost:3001'
  const BACKEND_URL = 'https://ai-story-generator-156s.onrender.com'; // <--- UPDATE THIS FOR DEPLOYMENT

  // Load saved stories from local storage on component mount
  useEffect(() => {
    try {
      const storedStories = localStorage.getItem('aiStories');
      if (storedStories) {
        setSavedStories(JSON.parse(storedStories));
      }
    } catch (e) {
      console.error("Failed to load stories from local storage:", e);
    }
  }, []);

  // Function to generate a story
  const generateStory = async () => {
    setStory('');
    setStoryTitle('');
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = `${BACKEND_URL}/generate-story`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mainCharacter,
          setting,
          conflict,
          storyLength,
          storyTone
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch story from backend.');
      }

      const result = await response.json();

      setStoryTitle(result.title || 'Untitled Story');
      setStory(result.story || 'No story content generated.');

    } catch (err) {
      console.error("Error generating story:", err);
      setError(`Error: ${err.message || 'Something went wrong while generating the story. Ensure backend is running.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate a random prompt
  const generateRandomPrompt = async () => {
    setPrompt('');
    setMainCharacter('');
    setSetting('');
    setConflict('');
    setStory('');
    setStoryTitle('');
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = `${BACKEND_URL}/generate-random-prompt`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate random prompt from backend.');
      }

      const result = await response.json();
      setPrompt(result.prompt);

    } catch (err) {
      console.error("Error generating random prompt:", err);
      setError(`Error: ${err.message || 'Something went wrong while generating a random prompt. Ensure backend is running.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyStoryToClipboard = () => {
    if (story) {
      const textToCopy = `${storyTitle}\n\n${story}`;
      const el = document.createElement('textarea');
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  const saveStory = () => {
    if (story && storyTitle) {
      const newStory = {
        id: Date.now(),
        title: storyTitle,
        content: story,
        date: new Date().toLocaleString()
      };
      const updatedStories = [...savedStories, newStory];
      setSavedStories(updatedStories);
      localStorage.setItem('aiStories', JSON.stringify(updatedStories));
      alert('Story saved successfully!');
    } else {
      alert('No story to save!');
    }
  };

  const loadStory = (storyToLoad) => {
    setStoryTitle(storyToLoad.title);
    setStory(storyToLoad.content);
    setPrompt('');
    setMainCharacter('');
    setSetting('');
    setConflict('');
    setShowSavedStoriesModal(false);
  };

  const deleteStory = (idToDelete) => {
    const updatedStories = savedStories.filter(s => s.id !== idToDelete);
    setSavedStories(updatedStories);
    localStorage.setItem('aiStories', JSON.stringify(updatedStories));
  };

  const clearAll = () => {
    setPrompt('');
    setMainCharacter('');
    setSetting('');
    setConflict('');
    setStory('');
    setStoryTitle('');
    setError('');
    setIsLoading(false);
    setStoryLength('medium');
    setStoryTone('neutral');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 sm:p-8 flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 z-0 animate-gradient-xy bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 opacity-30"></div>

      <div className="relative z-10 bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-4xl border border-purple-700 transform transition-all duration-500 ease-in-out hover:shadow-purple-500/50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 px-2 sm:px-4">
          {/* Adjusted font sizes and flex properties for the title */}
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-300 text-left w-full sm:flex-grow mb-4 sm:mb-0 drop-shadow-2xl pr-2 sm:pr-4"> {/* Changed font sizes and text-center to text-left */}
          Starlight Weaver
          </h1>
          <button
            onClick={clearAll}
            className="py-2 px-4 rounded-full text-sm font-semibold bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out shadow-md hover:shadow-lg flex-shrink-0"
            title="Clear all inputs and generated story"
          >
            Clear All
          </button>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="mainPrompt" className="block text-lg font-medium text-purple-300 mb-2">
              Main Idea/Plot (Optional):
            </label>
            <textarea
              id="mainPrompt"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-purple-600 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out resize-y min-h-[80px] shadow-inner focus:shadow-purple-500/40"
              rows="2"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A lone starship captain discovers a sentient nebula..."
              aria-label="Main story idea input"
            ></textarea>
          </div>

          <div>
            <label htmlFor="mainCharacter" className="block text-lg font-medium text-purple-300 mb-2">
              Main Character (Optional):
            </label>
            <input
              type="text"
              id="mainCharacter"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-purple-600 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out shadow-inner focus:shadow-purple-500/40"
              value={mainCharacter}
              onChange={(e) => setMainCharacter(e.target.value)}
              placeholder="e.g., An ancient dragon, a curious robot, a forgotten deity..."
              aria-label="Main character input"
            />
          </div>

          <div>
            <label htmlFor="setting" className="block text-lg font-medium text-purple-300 mb-2">
              Setting (Optional):
            </label>
            <input
              type="text"
              id="setting"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-purple-600 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out shadow-inner focus:shadow-purple-500/40"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="e.g., A hidden city beneath the ice, a bustling alien marketplace..."
              aria-label="Story setting input"
            />
          </div>

          <div>
            <label htmlFor="conflict" className="block text-lg font-medium text-purple-300 mb-2">
              Conflict/Goal (Optional):
            </label>
            <input
              type="text"
              id="conflict"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-purple-600 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out shadow-inner focus:shadow-purple-500/40"
              value={conflict}
              onChange={(e) => setConflict(e.target.value)}
              placeholder="e.g., Unraveling a cosmic mystery, escaping a time loop..."
              aria-label="Story conflict or goal input"
            />
          </div>
        </div>

        {/* Action Buttons & Selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={generateRandomPrompt}
            disabled={isLoading}
            className={`py-3 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out shadow-lg hover:shadow-xl
              ${isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105'
              }`}
            aria-live="polite"
          >
            {isLoading && (prompt === '' && mainCharacter === '' && setting === '' && conflict === '') ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Prompt...
              </span>
            ) : (
              'Generate Random Prompt'
            )}
          </button>

          <div className="relative">
            <label htmlFor="storyLength" className="sr-only">Story Length</label>
            <select
              id="storyLength"
              className="w-full p-3 rounded-full bg-gray-700 text-white border border-purple-600 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out appearance-none pr-8 shadow-inner"
              value={storyLength}
              onChange={(e) => setStoryLength(e.target.value)}
              aria-label="Select story length"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="storyTone" className="sr-only">Story Tone/Genre</label>
            <select
              id="storyTone"
              className="w-full p-3 rounded-full bg-gray-700 text-white border border-purple-600 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out appearance-none pr-8 shadow-inner"
              value={storyTone}
              onChange={(e) => setStoryTone(e.target.value)}
              aria-label="Select story tone or genre"
            >
              <option value="neutral">Neutral</option>
              <option value="mysterious">Mysterious</option>
              <option value="humorous">Humorous</option>
              <option value="dramatic">Dramatic</option>
              <option value="fantasy">Fantasy</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="horror">Horror</option>
              <option value="romantic">Romantic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
            </div>
          </div>
        </div>

        <button
          onClick={generateStory}
          disabled={isLoading || (!prompt.trim() && !mainCharacter.trim() && !setting.trim() && !conflict.trim())}
          className={`w-full py-4 px-6 rounded-full text-xl font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 hover:shadow-xl
            ${isLoading || (!prompt.trim() && !mainCharacter.trim() && !setting.trim() && !conflict.trim())
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800'
            }`}
          aria-live="polite"
        >
          {isLoading && (prompt.trim() || mainCharacter.trim() || setting.trim() || conflict.trim()) ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Weaving Your Story...
            </span>
          ) : (
            'Weave Story'
          )}
        </button>

        {error && (
          <div className="mt-8 p-4 bg-red-800 bg-opacity-70 rounded-xl border border-red-600 text-red-200 text-center shadow-md" role="alert">
            <p className="font-medium">Oops! Something went wrong:</p>
            <p>{error}</p>
          </div>
        )}

        {story && (
          <div className="mt-8 p-6 bg-gray-700 bg-opacity-80 rounded-2xl shadow-inner border border-purple-600">
            <h2 className="text-3xl font-bold text-purple-300 mb-4 text-center">{storyTitle}</h2>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-justify">{story}</p>
            <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={copyStoryToClipboard}
                className="flex-1 py-3 px-6 rounded-full text-md font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
              >
                Copy Story
              </button>
              <button
                onClick={saveStory}
                className="flex-1 py-3 px-6 rounded-full text-md font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
              >
                Save Story
              </button>
            </div>
          </div>
        )}

        {/* Saved Stories Button */}
        <div className="mt-8">
          <button
            onClick={() => setShowSavedStoriesModal(true)}
            className="w-full py-3 px-6 rounded-full text-lg font-semibold bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg transform hover:scale-105 transition duration-300 ease-in-out hover:shadow-xl"
          >
            View Saved Stories ({savedStories.length})
          </button>
        </div>

        {/* Saved Stories Modal */}
        {showSavedStoriesModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-purple-500 relative">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">Your Saved Stories</h2>
              <button
                onClick={() => setShowSavedStoriesModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
              {savedStories.length === 0 ? (
                <p className="text-gray-400">No stories saved yet. Start weaving!</p>
              ) : (
                <ul className="space-y-4">
                  {savedStories.map((s) => (
                    <li key={s.id} className="bg-gray-700 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-xl font-semibold text-purple-200">{s.title}</h3>
                        <p className="text-sm text-gray-400">{s.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadStory(s)}
                          className="py-2 px-4 rounded-lg text-sm font-semibold bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out shadow-sm"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteStory(s.id)}
                          className="py-2 px-4 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
