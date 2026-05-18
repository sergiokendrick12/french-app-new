from PIL import Image
img = Image.open('public/logo.png')
img = img.resize((32, 32))
img.save('public/favicon.ico')
print('Done!')
