import React, { Component, useState, useEffect, useReducer,  } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';

function delay (milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const capitaliseFirstCharacterInEachWord = (text) => {

  return  text.toLowerCase()
              .split(' ')
              .map((str) => str.charAt(0).toUpperCase() + str.substring(1))
              .join(' ');
};

const dataFetchReducer = (state, action) => {
  //console.log("DataFetcher --> Action : ", action.type);
  console.log("DataFetcher --> State : ", state);

  switch (action.type) {
    case "INIT":
      return { ...state, isLoading: true, isError: false, isHandleMoreData: false, value: "", data: [] };
    case "MOREDATA":
      return { ...state, isLoading: true, isError: false, isHandleMoreData: false, value: "", data: [] };
    case "LOADED":
      return { ...state, isLoading: false, isError: false, isHandleMoreData: false, value: "", data: action.payload, };
    case "ERROR":
      return { ...state, isLoading: false, isError: true, isHandleMoreData: false, value: "", data: [] };
    case "SEARCH":
      return { ...state, isLoading: false, isError: false, isHandleMoreData: false, value: action.payload.value, data: action.payload.data};
    default:
      throw new Error();
  }
};

const RenderHeader = ({value, update}) => {
  return (
    <SearchBar
    placeholder="Type Here..." autoCapitalize = 'none' lightTheme round autoCorrect={false}
    value={value} onChangeText={text => update(text)} 
    />
    );
  };
  
  
const initalValues = { isLoading: true, isError: false, isHandleMoreData: false, data: [], value: "", };
//const initalValues = {  };

  const FlatListDemo = () => {
  
  const [state, dispatch] = useReducer(dataFetchReducer, initalValues);

  let arrayholder = [];
 _renderHeader = () => <SearchBar placeholder="Type Here..." autoCapitalize = 'none' lightTheme round onChangeText={text => searchFilterFunction(text)} autoCorrect={false} value={state.value} />;

  useEffect(() => {

    console.log("********** useEffect - Begin **********");

    //dispatch({ type: 'INIT' })

    makeRemoteRequest();

    console.log("********** useEffect - End **********");

  }, []);

  const makeRemoteRequest = async () => {

    console.log("********** makeRemoteRequest - Begin **********");

    const url = `https://randomuser.me/api/?&results=20`;
    //console.log(url);

     delay(1000).then(res => {  // The fetch API call is in a delay to simulate the API taking time to complete.
       
       fetch(url)
       .then(res => res.json())
       .then(res => {
          console.log("Received data is successfull Size : ", res.results.length);

          this.arrayholder = res.results;
          dispatch({ type: 'LOADED', payload: res.results })         
        })
        .catch(error => {
          console.log("Received data error");

          dispatch({ type: 'ERROR', })  
        });
      });

    console.log("********** makeRemoteRequest - End **********");
  };

  const renderSeparator = () => {

    //console.log("********** renderSeparator **********");

    return ( <View style={{ height: 1, width: '86%', backgroundColor: '#CED0CE', marginLeft: '14%', }} /> );
  };

  const renderFooter = () => {

    //console.log("********** renderFooter **********");

//    if (!state.isLoading) return null;

    return ( <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }} /> );
  };

  const searchFilterFunction = (text) => {

    //console.log("searchFilterFunction - text : ", text);
//    console.log("searchFilterFunction - state : ", state);
//    console.log("searchFilterFunction - this : ", this.arrayholder);

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
      const textData = text.toUpperCase();

      //console.log("searchFilterFunction - itemData : ", itemData);

      return itemData.indexOf(textData) > -1;
    });

    const searchPayload = { value: text, data: newData };

    //console.log("searchFilterFunction - searchPayload : ", searchPayload);
    //console.log("searchFilterFunction - newData : ", newData);

    dispatch({ type: 'SEARCH', payload: searchPayload })
  };

  const renderIndividualItem = (item) => {

    //console.log("********** renderIndividualItem **********");

    return (
        <ListItem
                leftAvatar={{ source: { uri: item.picture.thumbnail } }}
                title={`${capitaliseFirstCharacterInEachWord(item.name.title)} ${capitaliseFirstCharacterInEachWord(item.name.first)} ${capitaliseFirstCharacterInEachWord(item.name.last)}`}
                subtitle={item.email}
        />
    );
  };

  const handleRefresh = () => {

    console.log("********** handleRefresh - Begin ********** Loading : ", state.isLoading);

    //setPage(1);
    //setSeed(seed + 1);
    //setRefreshing(true);


    //dispatch({ type: 'MOREDATA' })

    makeRemoteRequest();

    console.log("********** handleRefresh - End ********** Loading : ", state.isLoading);
};

const handleLoadMore = () => {

    console.log("********** handleLoadMore - Begin **********");

    //if(state.value.length === 0 || state.isHandleMoreData)  {
    if(state.value.length === 0)  {
      console.log("********** handleLoadMore --> Search not being used **********");

      //dispatch({ type: 'MOREDATA' })

      makeRemoteRequest();  // Only load more if search is not being used. This prevents load more being fired when a character is entered into search.
    }
    else {
      console.log("********** handleLoadMore --> Search being used therefore ignoring **********");
    }

    console.log("********** handleLoadMore - End **********");
}


  //console.log("About to render");
  //<RenderHeader value={state.value} update={searchFilterFunction} />
    
    if (state.isLoading) {
      console.log("Render : Loading is true");
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    else {
      console.log("Render : Loading is false ");
      return (
        <View style={styles.container}>
          <FlatList
            data={state.data}
            renderItem={({ item }) => ( renderIndividualItem(item) )}
            keyExtractor={item => item.email}
            ListHeaderComponent={<RenderHeader value={state.value} update={searchFilterFunction} />}
            ItemSeparatorComponent={renderSeparator}
            ListFooterComponent={renderFooter}
            onRefresh={handleRefresh}
            refreshing={state.isLoading}
            //onEndReached={handleLoadMore}
            //onEndReachedThreshold={0.25}
          />
        </View>
      );
    }
};

export default FlatListDemo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor:'white',
    //alignItems: 'center',
    //justifyContent: 'center',
    marginTop: Platform.OS == 'ios'? 30 : 0
  },
  textStyle: {
    padding: 10,
  },
  loader: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
  },
});
