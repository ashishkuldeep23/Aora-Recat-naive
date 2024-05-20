import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../context/ContextProvider';







const ModalComponent = () => {

    const MODAL_CONTENT = useGlobalContext().modalContent

    const { modalVisible, setModalVisible } = useGlobalContext()


    return (
        <View
            // style={styles.centeredView}
            className="flex justify-center items-center"
        >
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
            >

                <Pressable

                    onPress={() => { setModalVisible(false) }}>


                    <View
                        // style={styles.centeredView}

                        className=" h-full flex justify-center items-center"

                    >
                        <View
                            // style={styles.modalView}
                            className=" relative min-w-[70%] max-w-[85%] min-h-[20%] max-h-[40%] bg-white rounded-lg p-0.5 shadow-lg shadow-rose-700 border border-red-600"

                            style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}

                        >

                            {/* Here we can give content of modal. */}
                            {/* This div will contain content of modal -------> */}
                            <View>
                                {MODAL_CONTENT}
                            </View>


                            {/* This is close btn here ---------> */}
                            <TouchableOpacity
                                // style={[styles.button, styles.buttonClose]}

                                className=" absolute top-[-4.5%] left-[77.5%] px-2 rounded-2xl border border-red-600 bg-white "
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text
                                    className=" text-red-600 font-pbold text-xl"
                                // style={styles.textStyle}
                                >X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Pressable>

            </Modal>
        </View>
    );
};


export default ModalComponent;