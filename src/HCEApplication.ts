/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/**
 * This interface is intended to describe the "card application" state that
 * can be represented in Host card emulation. Intended to be immutable.
 */
export interface HCEApplication {
  /**
   * Internal unique identifier of application type.
   */
  type: string;

  /**
   * The content of application that can vary during the lifetime, e.g. internal files.
   */
  content: any;
}
