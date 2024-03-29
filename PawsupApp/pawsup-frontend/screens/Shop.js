import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView, TouchableOpacity, ImageBackground, ToastAndroid, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions, ViewPagerAndroidComponent} from 'react-native';
import Item from '../components/Item';
import { BackgroundStyle, StyledContainer2, PageTitle, } from './../components/styles';
import SERVER_URL from '../server-url';


const FILTER_IMG = require('./../assets/icons/filter.png');
const SORT_IMG = require('./../assets/icons/sort.png');
const WIDTH = Dimensions.get("window").width;
const SPACING = 20;

const Services = ({ navigation, route }) => {
    var tempData = [];
	const [filterVisible, setFilterVisible] = useState(false);
	const [selectedPrice, setSelectedPrice] = useState();
    const [selectedPetType, setSelectedPetType] = useState();
	const [displayData, setDisplayData] = useState(tempData);
    const [firstRender, setFirstRender] = useState(false);

    const getAllItems = () => {
        // const url = "https://protected-shelf-96328.herokuapp.com/api/getAllItems";
        const url = `http://${SERVER_URL}/api/getAllItems`;
        axios.get(url).then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            else {
                for(var i = 0; i < data.length; i++) {
                    var item = {
                        id: data[i].id + data[i].name + data[i].price + data[i].image,
                        name: data[i].name,
                        price: data[i].price,
                        image: data[i].image, 
                        description: data[i].description,
                        remaining: data[i].quantity
                    }
                    if(!tempData.includes(item)) tempData.push(item);
                }
                setDisplayData(tempData);
                setFilterVisible(true);
                setFilterVisible(false);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    }
    
    const addToData = (req) => {
        // const url = "https://protected-shelf-96328.herokuapp.com/api/getItem";
        const url = `http://${SERVER_URL}/api/getItem`;
        axios.get(url, {params: req}).then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            else {
                tempData.push(
                    {
                        id: data[0].id + data[0].name + data[0].price + data[0].image,
                        name: data[0].name,
                        price: data[0].price,
                        image: data[0].image, 
                        description: data[0].description,
                        remaining: data[0].quantity
                    });
                setDisplayData(tempData);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    }

    const handleFilterPrice = (req) => {
        // const url = "https://protected-shelf-96328.herokuapp.com/api/filterPriceItemListings" + req;
        const url = `http://${SERVER_URL}/api/filterPriceItemListings` + req;

        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                console.log(status);
                console.log(message);
                if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
                else {
                    console.log("hi?");
                    tempData = [];
                    setDisplayData(tempData);
                    console.log("again");
                    
                    for(var i = 0; i < data.length; i++) {
                        addToData({'name': data[i]});
                    }
                    console.log("at last");
                }
                
            })
            .catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            });
    }

    const handleFilterPetType = (req) => {
        // const url = "https://protected-shelf-96328.herokuapp.com/api/filterPettypeItemListings" + req;
        const url = `http://${SERVER_URL}/api/filterPettypeItemListings` + req;

        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
                else {
                    tempData = [];
                    setDisplayData(tempData);
                    console.log(data);
                    for(var i = 0; i < data.length; i++) {
                        addToData({name: data[i]});
                    }
                }
                
            })
            .catch((error) => {
                console.log(error);
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            });
    }
    
    useEffect(() => {
        if(!firstRender) {
            getAllItems();
            setFirstRender(true);
            setDisplayData(tempData);
        }
    });
    
    return (
        <StyledContainer2>
            <ImageBackground
                source={require('./../assets/WallpapersAndLogo/StorePage.png')}
                resizeMode="cover"
                style={BackgroundStyle.image}
            >
            </ImageBackground>

            <StatusBar style="light" />
            <PageTitle style={{color: 'black', marginTop: 10}}>Shop</PageTitle>
            
            {!filterVisible && 
                <SafeAreaView style={{marginTop: 20}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity
                            style={styles.cartButtonStyle}
                            onPress={
                                () => {
                                    var routeParams = route.params;
                                    navigation.navigate('Cart', {
                                        routeParams
                                    });
                                }
                            }
                            >
                            <Image
                                source={FILTER_IMG}
                                style={styles.sortButtonImageIconStyle}
                            />
                            <Text style={styles.cartButtonTextStyle}>
                                CART
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.filterButtonStyle}
                            onPress={() => {
                                setFilterVisible(!filterVisible);
                            }}
                            >
                            <Text style={styles.filterButtonTextStyle}>
                                FILTER & SORT
                            </Text>
                            <Image
                                source={FILTER_IMG}
                                style={styles.filterButtonImageIconStyle}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }
            
            {  /* filter stuff */}
            { filterVisible &&  
                <SafeAreaView style={{margin: 15, alignContent: 'center'}}>

                    {/* area for price filter   */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                Choose a price range:
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center'}}>    
                            <Picker
                                selectedValue={selectedPrice}
                                mode={'dropdown'}
                                dropdownIconColor={'red'}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        setSelectedPrice(itemValue);
                                        setSelectedPetType("a");
                                        if(itemValue === "a") handleFilterPrice("?minprice=0&maxprice=10000");
                                        if(itemValue === "b") handleFilterPrice("?minprice=0&maxprice=10");
                                        if(itemValue === "c") handleFilterPrice("?minprice=10&maxprice=20");
                                        if(itemValue === "d") handleFilterPrice("?minprice=20&maxprice=50");
                                        if(itemValue === "e") handleFilterPrice("?minprice=50&maxprice=100");
                                        if(itemValue === "f") handleFilterPrice("?minprice=100&maxprice=10000");
                                    }
                                } 
                            >
                                <Picker.Item label="Any" value="a" />
                                <Picker.Item label="Under $10" value="b" />
                                <Picker.Item label="$10 to $20" value="c" />
                                <Picker.Item label="$20 to $50" value="d" />
                                <Picker.Item label="$50 to $100" value="e" />
                                <Picker.Item label="Over $100" value="f" />
                            </Picker>
                        </View>
                    </SafeAreaView>


                    {/* area for pet-type filter  */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                Choose a pet type:
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center'}}>    
                            <Picker
                                selectedValue={selectedPetType}
                                mode={'dropdown'}
                                dropdownIconColor={'red'}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        setSelectedPetType(itemValue);
                                        setSelectedPrice("a");
                                        if(itemValue === "a") handleFilterPetType("?pettype=any");
                                        if(itemValue === "b") handleFilterPetType("?pettype=dog");
                                        if(itemValue === "c") handleFilterPetType("?pettype=cat");
                                        if(itemValue === "d") handleFilterPetType("?pettype=hamster");
                                        if(itemValue === "e") handleFilterPetType("?pettype=rabbit");
                                        if(itemValue === "f") handleFilterPetType("?pettype=fish");
                                        if(itemValue === "g") handleFilterPetType("?pettype=robot");
                                        if(itemValue === "h") handleFilterPetType("?pettype=rhino");
                                    }
                                }
                            >
                                <Picker.Item label="Any" value="a" />
                                <Picker.Item label="Dog" value="b" />
                                <Picker.Item label="Cat" value="c" />
                                <Picker.Item label="Hamster" value="d" />
                                <Picker.Item label="Rabbit" value="e" />
                                <Picker.Item label="Fish" value="f" />
                                <Picker.Item label="Robot" value="g" />
                                <Picker.Item label="Rhino" value="h" />

                            </Picker>
                        </View>
                    </SafeAreaView>

                    <TouchableOpacity
                        style={{
                            marginTop: 30,
                            flexDirection: 'row',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderWidth: 3,
                            borderColor: '#000',
                            width: WIDTH / 2 - 30,
                            height: 50,
                            borderRadius: 10,
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            setFilterVisible(!filterVisible);
                        }}
                    >
                        <Text style={{
                            fontSize: 20,
                            alignSelf: 'center',
                            color: '#000',
                            flex: 1,
                            textAlign: 'center',
                        }}>
                            DONE
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            }

            { /* items themselves  */}
			{ !filterVisible && displayData.length > 0 &&
				<SafeAreaView style={styles.container}>
					<FlatList
						data={displayData}
						style={{ flex: 1 }}
						contentContainerStyle={{
							padding: SPACING
						}}
						columnWrapperStyle={{
							justifyContent: 'space-between',
							marginBottom: 15,
						}}
						numColumns={2}
						renderItem={({item, index}) => {
							
							return (
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            var routeParams = route.params;
                                            navigation.navigate('DetailedItem', {
                                                routeParams,
                                                itemname: item.name
                                            });
                                        }
                                    }
                                >
                                    <Item item={item} />
                                </TouchableOpacity>
                            )
						}}
						keyExtractor={item => item.id}
					/>
				</SafeAreaView>
			}

            { /* No items found message  */}
			{ !filterVisible && displayData.length === 0 &&
				<SafeAreaView style={styles.container}>
					<Text style={{alignSelf: 'center', fontSize: 30, fontWeight: 'bold'}}>
                        No items found!
                    </Text>
				</SafeAreaView>
			}
		</StyledContainer2>
	);
}

const styles = StyleSheet.create({
    dropdownstyle: {
        backgroundColor: 'black',
    },
    container: {
        paddingHorizontal: 5,
        flex: 1,
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,  
    },
    title: {
        fontSize: 32,
    },
    bgimg: {
        flex: 1,
        justifyContent: "center"
    },
    filterButtonStyle: {
        marginRight: 25,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderWidth: 0,
        borderColor: '#000',
        width: WIDTH / 2 - 40,
        height: 28,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        borderRadius: 10,
    },
    cartButtonStyle: {
        marginLeft: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderWidth: 0,
        borderColor: '#000',
        width: WIDTH / 2 - 40,
        height: 28,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        borderRadius: 10,
    },
    filterButtonImageIconStyle: {
        width: 35,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        height: '100%',
        resizeMode: 'contain',
    },
    sortButtonImageIconStyle: {
        width: 35,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        height: '100%',
        resizeMode: 'contain',
    },
    filterButtonTextStyle: {
        fontSize: 17,
        alignSelf: 'center',
        marginLeft: 2,
        marginTop: 2,
        color: '#000',
        flex: 1,
        textAlign: 'right',
    },
    cartButtonTextStyle: {
        fontSize: 17,
        alignSelf: 'center',
        marginRight: 2,
        marginTop: 2,
        color: '#000',
        flex: 1,
        textAlign: 'left',
    },

});

export default Services;
