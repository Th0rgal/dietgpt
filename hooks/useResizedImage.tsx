import { useEffect, useState } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import { ImagePickerAsset } from "expo-image-picker";

const useResizedImage = (image) => {
  const [resizedImage, setResizedImage] =
    useState<ImageManipulator.ImageResult | null>(null);

  const resizeAndConvertToBase64 = async (asset: ImagePickerAsset) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 896 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      return resizedImage;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (image) {
      resizeAndConvertToBase64(image).then(setResizedImage);
    }
  }, [image]);

  return resizedImage;
};

export default useResizedImage;
