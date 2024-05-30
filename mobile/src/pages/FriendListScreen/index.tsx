import {selectFriends} from '@/store/reducers/friends/selectors';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import FriendListItem from './components/FriendListItem';
import {Button} from '@/components';

export default function ChatList() {
  const friends = useSelector(selectFriends);
  return (
    <FlatList
      data={friends}
      renderItem={({item}) => <FriendListItem key={item.id} {...item} />}
      contentContainerStyle={styles.contentContainer}
      ListFooterComponent={() => <Button label="Yeni kişi ekle" />}
      ListFooterComponentStyle={styles.listFooterStyle}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 16,
  },
  listFooterStyle: {
    paddingVertical: 6,
  },
});
