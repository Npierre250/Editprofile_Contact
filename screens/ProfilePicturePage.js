import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const ProfilePicturePage = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const toggleCamera = () => {
        setIsCameraActive(prevState => !prevState);
    };

    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setCapturedImages(prevImages => [...prevImages, photo.uri]); // Add new image URI to the array
            setIsCameraActive(false); // Close the camera view after taking a picture
            console.log("Captured Image URI:", photo.uri);
        }
    };

    const selectPicture = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to upload a picture.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            multiple: true, // Allow multiple image selection
        });

        if (!result.cancelled) {
            const selectedImages = result?.assets?.map(asset => asset.uri) ?? [];
            setCapturedImages(selectedImages); // Update the array with selected image URIs
            console.log("Selected Images URIs:", selectedImages);
        } else {
            console.log("Image selection cancelled.");
        }
    };

    return (
        <View style={styles.container}>
            {hasPermission === null ? (
                <View />
            ) : hasPermission === false ? (
                <Text>No access to camera</Text>
            ) : (
                <>
                    {isCameraActive ? (
                        <Camera style={styles.camera} ref={ref => setCameraRef(ref)}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={takePicture}>
                                    <Text style={styles.text}>Take Picture</Text>
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    ) : (
                        <View style={styles.profileContainer}>
                            <View style={styles.imageContainer}>
                                {capturedImages.map((uri, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: uri }}
                                        style={styles.selectedImage}
                                        resizeMode="contain"
                                    />
                                ))}
                            </View>
                            <TouchableOpacity style={styles.activateButton} onPress={toggleCamera}>
                                <Text style={styles.activateButtonText}>
                                    {capturedImages.length > 0 ? 'Retake Picture' : 'Activate Camera'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={capturedImages.length > 0 ? null : selectPicture}
                            >
                                <Text style={styles.uploadButtonText}>
                                    {capturedImages.length > 0 ? 'Upload Picture' : 'Select Picture'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 15,
        paddingHorizontal: 30,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 18,
        color: 'black',
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
        borderCurve:30,
    },
    selectedImage: {
        width: 100,
        height: 100,
        margin: 5,
    },
    activateButton: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 15,
        paddingHorizontal: 30,
        marginBottom: 10,
    },
    activateButtonText: {
        fontSize: 18,
        color: 'white',
    },
    uploadButton: {
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 15,
        paddingHorizontal: 30,
    },
    uploadButtonText: {
        fontSize: 18,
        color: 'white',
        borderRadius:100,
    },
});

export default ProfilePicturePage;

