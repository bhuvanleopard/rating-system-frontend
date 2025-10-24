import React from 'react';
import { 
  Activity, 
  BarChart3, 
  Server, 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle 
} from 'lucide-react';

/*
----------------------------------------------------------------------
 MOCK UI COMPONENTS (Internal)
 (Visuals to represent each feature point, no functionality)
----------------------------------------------------------------------
*/

/**
 * Mock UI for the Real-Time Data Sync
 */
const RealTimeSyncMock: React.FC = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h4 className="font-semibold text-gray-800">Live Poll: Session Active</h4>
      <span className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span>LIVE</span>
      </span>
    </div>
    
    <div className="space-y-3">
      <button 
        type="button"
        className="w-full flex justify-center items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
      >
        <ThumbsUp className="w-5 h-5 text-green-500" />
        <span>Vote: Awesome!</span>
      </button>
      <button 
        type="button"
        className="w-full flex justify-center items-center space-x-2 px-4 py-3 border border-transparent rounded-md shadow-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all ring-4 ring-indigo-500 ring-opacity-50 animate-pulse"
      >
        <ThumbsDown className="w-5 h-5 text-white" />
        <span>Vote: Needs Work</span>
      </button>
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
      <div className="flex items-center space-x-1 text-gray-500">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span>Vote Sent!</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-500">
        <Users className="w-4 h-4" />
        <span>1,204 Clients Connected</span>
      </div>
    </div>
  </div>
);

/**
 * Mock UI for the Dynamic Result Visualization
 */
const VisualizationMock: React.FC = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 h-full flex flex-col justify-between">
    <div>
      <h4 className="font-semibold text-gray-800 mb-4">Live Results</h4>
      <div className="space-y-4">
        {/* Bar 1 */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Awesome!</span>
            <span className="text-sm font-bold text-green-600">68% (820)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: '68%' }}
            ></div>
          </div>
        </div>
        
        {/* Bar 2 (Animating) */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Needs Work</span>
            <span className="text-sm font-bold text-indigo-600">32% (384)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-indigo-500 h-4 rounded-full transition-all duration-500 animate-pulse" 
              style={{ width: '32%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-4 text-center">
      Charts update automatically via WebSocket events...
    </p>
  </div>
);

/**
 * Mock UI for the Scalable Backend Architecture
 */
const BackendMock: React.FC = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 h-full flex flex-col items-center justify-center text-center">
    <div className="relative flex items-center justify-center">
      {/* Mock user icons */}
      <Users className="w-6 h-6 text-gray-400 absolute" style={{ transform: 'translate(-40px, -40px)' }} />
      <Users className="w-6 h-6 text-gray-400 absolute" style={{ transform: 'translate(40px, -40px)' }} />
      <Users className="w-6 h-6 text-gray-400 absolute" style={{ transform: 'translate(-50px, 0px)' }} />
      <Users className="w-6 h-6 text-gray-400 absolute" style={{ transform: 'translate(50px, 0px)' }} />
      <Users className="w-6 h-6 text-gray-400 absolute" style={{ transform: 'translate(-40px, 40px)' }} />
      <Users className="w-6 h-6 text-gray-400 absolute" style={{ transform: 'translate(40px, 40px)' }} />
      
      {/* Central Server */}
      <div className="relative bg-indigo-600 rounded-full p-6 shadow-xl">
        <Server className="w-12 h-12 text-white" />
      </div>
    </div>
    
    <h4 className="font-semibold text-gray-800 mt-6">Robust Server</h4>
    <p className="text-sm text-gray-600 mt-2">
      Managing multiple concurrent WebSocket connections efficiently.
    </p>
    
    <div className="mt-4 space-y-1">
      <p className="text-xs font-medium text-gray-800">
        <span className="font-bold text-indigo-600">50,000+</span> Concurrent Users
      </p>
      <p className="text-xs font-medium text-gray-800">
        <span className="font-bold text-indigo-600">800 votes/sec</span> Processing
      </p>
    </div>
  </div>
);


/*
----------------------------------------------------------------------
 MAIN EXPORTED COMPONENT
 (This is the single component you'd import into your app)
----------------------------------------------------------------------
*/

const LiveVotingFeatures: React.FC = () => {
  
  const features = [
    {
      title: "Real-Time Data Sync",
      description: "Implemented a persistent, bi-directional communication channel using WebSockets, enabling instantaneous submission of ratings and live synchronization of poll results across all connected clients.",
      icon: Activity,
      mockUI: <RealTimeSyncMock />
    },
    {
      title: "Dynamic Result Visualization",
      description: "Developed a responsive front-end interface that listens for WebSocket events to dynamically render and animate result charts in real-time, providing an engaging and interactive user experience.",
      icon: BarChart3,
      mockUI: <VisualizationMock />
    },
    {
      title: "Scalable Backend Architecture",
      description: "Engineered a robust server-side application capable of managing multiple concurrent WebSocket connections, efficiently processing incoming votes, and broadcasting updates to maintain data integrity at scale.",
      icon: Server,
      mockUI: <BackendMock />
    }
  ];

  return (
    <section className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            The Power of Live Feedback
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A system built from the ground up for instantaneous, reliable, and 
            scalable user interaction.
          </p>
        </div>

        {/* --- Features Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title} 
                className="flex flex-col bg-white rounded-xl shadow-xl overflow-hidden"
              >
                {/* --- Text Content --- */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* --- Mock UI Visual --- */}
                <div className="flex-grow bg-gray-100 p-6 md:p-8 flex items-stretch">
                  {feature.mockUI}
                </div>
              </div>
            );
          })}
          
        </div>

      </div>
    </section>
  );
};

export default LiveVotingFeatures;