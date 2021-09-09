'''
Use this when you modified any css in the css/ folder.
'''

import os

try:
    from csscompressor import compress
except ModuleNotFoundError:
    os.system("python -m pip install csscompressor")
    from csscompressor import compress

def main():
    not_minified =  [f"./css/{f}" for f in os.listdir("./css") if not f.endswith(".min.css")]
    
    for file in not_minified:
        print(file)
        with open(file, "r") as input_file:
            css_minified = compress(input_file.read())

        with open(f"{file.replace('.css', '')}.min.css", "w") as output_file:
            output_file.write(css_minified)

if __name__ == "__main__":
    main()
