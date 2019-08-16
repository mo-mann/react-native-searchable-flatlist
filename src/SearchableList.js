import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';

function delay (milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class FlatListDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      value: ""
    };

    this.arrayholder = [];
  }

  componentDidMount() {

    console.log("********** componentDidMount - Begin **********");
    
    this.makeRemoteRequest();

    console.log("********** componentDidMount - End **********");
   
  }

  makeRemoteRequest = () => {

    console.log("********** makeRemoteRequest - Begin **********");

    const url = `https://randomuser.me/api/?&results=20`;
    this.setState({ loading: true });

     delay(1000).then(res => {  // The fetch API call is in a delay to simulate the API taking time to complete.
       
       fetch(url)
       .then(res => res.json())
       .then(res => {
         this.setState({
           data: res.results,
           error: res.error || null,
           loading: false,
          });
          this.arrayholder = res.results;
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
      });

      console.log("********** makeRemoteRequest - End **********");
    };


  handleLoadMore = () => {

    console.log("********** handleLoadMore - Begin **********");

    if(this.state.value.length === 0) {
      console.log("********** handleLoadMore --> Search not being used **********");
      this.makeRemoteRequest();  // Only load more if search is not being used. This prevents load more being fired when a character is entered into search.
    }
    else {
      console.log("********** handleLoadMore --> Search being used therefore ignoring **********");
    }

    console.log("********** handleLoadMore - End **********");
  }

  renderSeparator = () => {

    //console.log("********** renderSeparator **********");

    return (
      <View
        style={{
          height: 5,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = text => {

    console.log("********** searchFilterFunction **********");

    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
      const textData = text.toUpperCase();

      //console.log("searchFilterFunction - itemData : ", itemData);
      
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

capitaliseFirstCharacterInEachWord = (text) => {

  let newName = text.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');

  //console.log("name", newName);

  return newName;
}

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Type Here..."
        autoCapitalize = 'none'
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              leftAvatar={{ source: { uri: item.picture.thumbnail } }}
              title={`${this.capitaliseFirstCharacterInEachWord(item.name.title)} ${this.capitaliseFirstCharacterInEachWord(item.name.first)} ${this.capitaliseFirstCharacterInEachWord(item.name.last)}`}
              subtitle={item.email}
            />
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.25}
        />
      </View>
    );
  }
}

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
