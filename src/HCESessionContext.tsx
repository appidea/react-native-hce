/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React, { createContext, useEffect, useState } from 'react';
import { HCESession } from './HCESession';

/**
 * Interface to specify the value of {@link HCESessionContext}.
 *
 * The only one element is a {@link HCESession} class.
 *
 * @group React
 */
export interface HCEReactContextValue {
  session: HCESession;
}

/**
 * {@link https://reactjs.org/docs/context.html React Context} wrapper for {@link HCESession} class.
 *
 * Use in couple with {@link HCESessionProvider}
 *
 * @group React
 */
export const HCESessionContext = createContext<HCEReactContextValue>({
  session: new HCESession(),
});

/**
 * {@link https://reactjs.org/docs/context.html React Context} wrapper for {@link HCESession} class - provider.
 *
 * Use it to provide the singleton instance of {@link HCESession}
 * to React application instead of calling {@link HCESession.getInstance} manually.
 * The provider will not render the children until the HCESession class will not be
 * properly picked or created.
 *
 * @group React
 * @constructor
 */
export const HCESessionProvider: React.FC<{
  children?: React.ReactNode;
}> = (props) => {
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
