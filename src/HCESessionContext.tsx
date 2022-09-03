/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React, { createContext, useEffect, useState } from 'react';
import { HCESession } from './HCESession';

interface HCEReactContextProps {
  session: HCESession;
}

export const HCESessionContext = createContext<HCEReactContextProps>({
  session: new HCESession(),
});

export const HCESessionProvider: React.FC = (props) => {
  const [session, setSession] = useState<HCESession>();

  useEffect(() => {
    if (!session) {
      HCESession.getInstance().then((instance) => {
        setSession(instance);
      });
    }
  }, [session, setSession]);

  if (!session) {
    return null;
  }

  return <HCESessionContext.Provider value={{ session }} {...props} />;
};
