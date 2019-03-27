import os
import re

interfaces = []

packageRe = re.compile('package (.*);')

print('Detecting interfaces ...')
for dirName, subdirList, fileList in os.walk('sourcecode'):
    for fname in fileList:
        if fname.endswith('.java'):
            javaname = fname[:-5]
            with open(dirName + '/' + fname, "r") as f:
                package = ''
                for line in f:
                    m = packageRe.match(line)
                    if m:
                        package = m.group(1)
                    if ("interface "+javaname) in line:
                        interface = package+'.'+javaname
                        print(interface)
                        interfaces.append(interface)

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