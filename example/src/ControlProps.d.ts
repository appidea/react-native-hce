import { NFCContentType } from 'react-native-hce';

interface LogEntry {
  time: string,
  message: string
}

export interface ControlProps {
  contentType: string,
  selectNFCType: (type: NFCContentType) => void,
  content: string,
  selectNFCContent: (text: string) => void,
  contentWritable: boolean,
  toggleNFCWritable: () => void,
  simulationEnabled: boolean,
  startSimulation: () => void,
  terminateSimulation: () => void,
  logMsg: LogEntry[]
}
