import * as React from 'react'
import {
  centerCrop,
  makeAspectCrop,
  ReactCrop,
  type Crop,
  type PixelCrop,
  type ReactCropProps,
} from 'react-image-crop'

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

interface ImageCropRef {
  getResult: () => Promise<Blob>
}

interface ImageCropProps
  extends Omit<ReactCropProps, 'crop' | 'onChange' | 'onComplete'> {
  src: string
  scale?: number
  rotate?: number
}

const ImageCrop = React.forwardRef<ImageCropRef, ImageCropProps>(
  ({ src, aspect, scale = 1, rotate = 0, ...props }, ref) => {
    const imgRef = React.useRef<HTMLImageElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    const [crop, setCrop] = React.useState<Crop>()
    const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()

    const onImageLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
      if (aspect) {
        const { width, height } = ev.currentTarget

        setCrop(centerAspectCrop(width, height, aspect))
      }
    }

    React.useImperativeHandle(ref, () => {
      return {
        async getResult() {
          const image = imgRef.current
          const canvas = canvasRef.current

          if (!image || !canvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
          }

          const canvasCtx = canvas.getContext('2d')

          if (!canvasCtx) {
            throw new Error('No 2d context')
          }

          const scaleX = image.naturalWidth / image.width
          const scaleY = image.naturalHeight / image.height

          const pixelRatio = window.devicePixelRatio

          canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
          canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio)

          canvasCtx.scale(pixelRatio, pixelRatio)
          canvasCtx.imageSmoothingQuality = 'high'

          const cropX = completedCrop.x * scaleX
          const cropY = completedCrop.y * scaleY

          const rotateRads = rotate * (Math.PI / 180)
          const centerX = image.naturalWidth / 2
          const centerY = image.naturalHeight / 2

          canvasCtx.save()

          // 5) Move the crop origin to the canvas origin (0,0)
          canvasCtx.translate(-cropX, -cropY)

          // 4) Move the origin to the center of the original position
          canvasCtx.translate(centerX, centerY)

          // 3) Rotate around the origin
          canvasCtx.rotate(rotateRads)

          // 2) Scale the image
          canvasCtx.scale(scale, scale)

          // 1) Move the center of the image to the origin (0,0)
          canvasCtx.translate(-centerX, -centerY)

          canvasCtx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
          )

          canvasCtx.restore()

          const offscreen = new OffscreenCanvas(
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
          )

          const offscreenCtx = offscreen.getContext('2d')

          if (!offscreenCtx) {
            throw new Error('No 2d context')
          }

          offscreenCtx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            offscreen.width,
            offscreen.height,
          )

          return await offscreen.convertToBlob({
            type: 'image/jpg',
            quality: 0.8,
          })
        },
      }
    })

    return (
      <>
        <ReactCrop
          crop={crop}
          aspect={aspect}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={c => setCompletedCrop(c)}
          {...props}
        >
          <img
            ref={imgRef}
            src={src}
            alt="Cropping image"
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`,
            }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
        {completedCrop && (
          <canvas
            ref={canvasRef}
            style={{
              display: 'none',
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        )}
      </>
    )
  },
)

ImageCrop.displayName = 'ImageCrop'

export { ImageCrop, type ImageCropProps, type ImageCropRef }
