import {useNavigation as useBaseNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function useNavigation() {
  return useBaseNavigation<NativeStackNavigationProp<RootStackParamList>>();
}

export default useNavigation;
