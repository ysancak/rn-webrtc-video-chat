import {useRoute as useBaseRoute, RouteProp} from '@react-navigation/native';

function useRoute<RouteName extends keyof RootStackParamList>() {
  return useBaseRoute<RouteProp<RootStackParamList, RouteName>>();
}

export default useRoute;
