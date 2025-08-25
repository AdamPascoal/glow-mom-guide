import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MotherhoodStage = 'Trying to Conceive' | 'Incubator Stage' | 'Veteran Stage';

interface MotherhoodStageContextType {
  currentStage: MotherhoodStage;
  setCurrentStage: (stage: MotherhoodStage) => void;
  getVisibleTrackers: () => string[];
  isTrackerVisible: (trackerId: string) => boolean;
}

const MotherhoodStageContext = createContext<MotherhoodStageContextType | undefined>(undefined);

const TRACKER_VISIBILITY = {
  'Trying to Conceive': {
    tabs: ['overview', 'tasks'],
    taskModules: ['mood-tracker', 'sleep-tracker', 'vitamin-supplement', 'symptoms-tracker'],
    pregnancyJourney: false
  },
  'Incubator Stage': {
    tabs: ['overview', 'tasks'],
    taskModules: ['mood-tracker', 'sleep-tracker', 'doctor-appointment', 'vitamin-supplement', 'medical-test', 'personal-reminder', 'symptoms-tracker'],
    pregnancyJourney: true
  },
  'Veteran Stage': {
    tabs: ['overview', 'tasks'],
    taskModules: ['mood-tracker', 'sleep-tracker', 'doctor-appointment', 'vitamin-supplement', 'personal-reminder', 'symptoms-tracker'],
    pregnancyJourney: false
  }
};

export function MotherhoodStageProvider({ children }: { children: ReactNode }) {
  const [currentStage, setCurrentStageInternal] = useState<MotherhoodStage>('Incubator Stage');

  useEffect(() => {
    const savedStage = localStorage.getItem('motherhood-stage') as MotherhoodStage;
    if (savedStage && Object.keys(TRACKER_VISIBILITY).includes(savedStage)) {
      setCurrentStageInternal(savedStage);
    }
  }, []);

  const setCurrentStage = (stage: MotherhoodStage) => {
    setCurrentStageInternal(stage);
    localStorage.setItem('motherhood-stage', stage);
  };

  const getVisibleTrackers = () => {
    return TRACKER_VISIBILITY[currentStage].tabs;
  };

  const isTrackerVisible = (trackerId: string) => {
    const config = TRACKER_VISIBILITY[currentStage];
    
    if (trackerId === 'pregnancy-journey') {
      return config.pregnancyJourney;
    }
    
    if (trackerId === 'tasks') {
      return config.tabs.includes(trackerId);
    }
    
    return config.taskModules.includes(trackerId);
  };

  return (
    <MotherhoodStageContext.Provider value={{
      currentStage,
      setCurrentStage,
      getVisibleTrackers,
      isTrackerVisible
    }}>
      {children}
    </MotherhoodStageContext.Provider>
  );
}

export function useMotherhoodStage() {
  const context = useContext(MotherhoodStageContext);
  if (context === undefined) {
    throw new Error('useMotherhoodStage must be used within a MotherhoodStageProvider');
  }
  return context;
}