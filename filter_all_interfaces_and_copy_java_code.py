import os
import re

interfaces = []

packageRe = re.compile('package (.*);')

print('Detecting interfaces ...')
with open('data/java_code.js', "w") as fout:
    fout.write('javaCode = {')
    for dirName, subdirList, fileList in os.walk('sourcecode'):
        for fname in fileList:
            if fname.endswith('.java'):
                javaname = fname[:-5]
                with open(dirName + '/' + fname, "r") as fin:
                    package = ''
                    code = ''
                    for line in fin:
                        m = packageRe.match(line)
                        if m:
                            package = m.group(1)
                        if package:
                            code += line.replace('`',"'").replace('\\','/')
                        if ('interface '+javaname) in line:
                            interface = package+'.'+javaname
                            print(interface)
                            interfaces.append(interface)
                    fout.write('"'+package+'.'+javaname+'" : \n`')
                    fout.write(code)
                    fout.write('`\n,\n')
    fout.write('};')

print('\nFilter csv files ...')
for dirName, subdirList, fileList in os.walk('csv'):
    for fname in fileList:
        if fname.endswith('.csv') and not fname.endswith('_filtered.csv'):
            with open(dirName + '/' + fname, "r") as fin:
                with open(dirName + '/' + fname[:-4]+'_filtered.csv', "w") as fout:
                    count = 0
                    for line in fin:
                        javaname = line.split(',')[0]
                        if javaname not in interfaces:
                            fout.write(line)
                        else:
                            count += 1
                    print('Removed '+str(count) + ' interfaces from '+fname)
