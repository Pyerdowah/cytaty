import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';

export default function App() {

  return (
      <UserAnswer/>
  );
}

let quote = "Gościu siądź pod mym liściem, a odpocznij sobie!";
const answer = quote.split(" ");
const shuffledAnswer = shuffleAnswer(answer);
var userAnswer = Array(answer.length).fill('_____________');
var id = 0;

function shuffleAnswer(array: string[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

const UserAnswer = () => {
  const [filledData, setData] = useState(userAnswer);
  const [refresh, setRefresh] = useState(false);
  const [winModalVisible, setWinModalVisible] = useState(false);
  const [lostModalVisible, setLostModalVisible] = useState(false);
  const [shuffledData, setShuffledData] = useState(shuffledAnswer);
  const [refreshButtons, setRefreshButtons] = useState(false);

  const updateGuessList = (item: string) => {
    id = userAnswer.findIndex(i => i == '_____________');
    userAnswer[id] = item;
    setData(userAnswer);
    setRefresh(!refresh);
    updateButtons(item);
    checkWinning();
  };

  const updateButtons = (item: string) => {
    var idx = shuffledData.findIndex(i => i == item);
    shuffledData.splice(idx, 1);
    setShuffledData(shuffledData);
    setRefreshButtons(!refreshButtons);
  };

  function checkWinning() {
    if (id == userAnswer.length - 1 && JSON.stringify(answer) === JSON.stringify(userAnswer)) {
      setWinModalVisible(true);
    }
    else if (id == userAnswer.length - 1 && JSON.stringify(answer) !== JSON.stringify(userAnswer)) {
      setLostModalVisible(true);
    }
  }

  const refreshAttempt = () => {
    userAnswer = Array(answer.length).fill('_____________')
    id = 0;
    setData(userAnswer);
    setRefresh(!refresh);
    setShuffledData(shuffleAnswer(answer));
    setRefreshButtons(!refreshButtons);
    ;  };

  const removeLast = () => {
    var idx = userAnswer.findIndex(i => i == '_____________');
    if (idx == 0) {
      idx = 0
    }
    else {
      idx--;
      shuffledData.push(userAnswer[idx]);
      userAnswer[idx] = '_____________';
    }
    setData(userAnswer);
    setShuffledData(shuffledData);
    setRefresh(!refresh);
    setRefreshButtons(!refreshButtons);
  };

  const renderButton = ({ item }: any) => {
    return <Pressable onPress={() => updateGuessList(item)}><Text style={styles.buttons}>{item}</Text></Pressable>
  };

  const renderGuessListItem = ({ item }: any) => {
    return <Pressable onPress={removeLast}><Text style={[styles.lines, {color: getColor(item)}]}>{item}</Text></Pressable>
  };

  function getColor(item: string) {
    var color = 'gray';
    if (id == userAnswer.length - 1) {
      if (answer.findIndex(i => i == item)  == userAnswer.findIndex(i => i == item) ) {
        color = 'green';
      }
      else {
        color = 'red';
      }
    }
    return color;
  }

  return (
      <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={winModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setWinModalVisible(!winModalVisible);
            }}>
          <View style={styles.modalContainer}>
            <Image source={require('./assets/chicken.jpeg')}  style={styles.modalImage}/>
            <Pressable
                style={[styles.buttons]}
                onPress={() => setWinModalVisible(!winModalVisible)}>
              <Text>Przejdź dalej!</Text>
            </Pressable>
          </View>
        </Modal>
        <Modal
            animationType="slide"
            transparent={true}
            visible={lostModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setLostModalVisible(!lostModalVisible);
            }}>
          <View style={styles.modalContainer}>
            <Image source={require('./assets/sadChicken.jpg')}  style={styles.modalImage}/>
            <Pressable
                style={[styles.buttons]}
                onPress={() => setLostModalVisible(!lostModalVisible)}>
              <Text>Spróbuj jeszcze raz!</Text>
            </Pressable>
          </View>
        </Modal>
        <View style={styles.refreshAttempt}>
          <Pressable style={styles.buttons} onPress={refreshAttempt}><Text>Ponów próbę</Text></Pressable>
        </View>
        <View style={styles.buttonsContainer}>
          <FlatList horizontal
                    data={filledData}
                    renderItem={renderGuessListItem}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={refresh}
                    contentContainerStyle={styles.answerContainer}/>
        </View>
        <View style={styles.buttonsContainer}>
          <FlatList horizontal
                    data={shuffledData}
                    renderItem={renderButton}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={refreshButtons}
                    contentContainerStyle={styles.answerContainer}/>
        </View>
        <StatusBar style="auto" />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0d9c3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flex: 1,
    backgroundColor: '#e0d9c3',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  refreshAttempt: {
    flex: 1,
    backgroundColor: '#e0d9c3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerContainer: {
    flex: 1,
    backgroundColor: '#e0d9c3',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttons: {
    margin: 5,
    backgroundColor: '#c3e0cb',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'gray'
  },
  lines: {
    marginTop: 36,
    marginLeft: 5,
    marginRight: 5,
    color: 'gray',
    fontWeight: 'bold',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: '75%'
  }
});