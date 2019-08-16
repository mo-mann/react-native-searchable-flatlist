/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { SafeAreaView } from 'react-native';
//import SearchableFlatList from './src/SearchableList';
import SearchableFlatList from './src/SearchableListFuncComp';

const App = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <SearchableFlatList />
  </SafeAreaView>
);

export default App;
