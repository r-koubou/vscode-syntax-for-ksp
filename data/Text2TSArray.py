# encode: utf-8

import sys

ARGV = sys.argv

TEMPLATE = "    \"{name}\","

HEADER = """//
// Generated by /data/Text2TSArray.py
// args: {args}
//
export var {variableName} : string[] = [
"""
FOOTER = "];"

inputFile    = ARGV[ 1 ]
outputFile   = ARGV[ 2 ]
variableName = ARGV[ 3 ]
excludes     = []
if( len( ARGV ) > 5 ):
    for i in ARGV[4:] :
        excludes.append( i.strip() )

fsin  = open( inputFile, "r",  encoding = "utf-8" )
fsout = open( outputFile, "w" )

argsText = " ".join( ARGV[1:] )
fsout.write( HEADER.format( variableName = variableName, args = argsText ) )

line = fsin.readline()
while line:
    line = line.strip()

    if( line in excludes ):
        None
    else:
        fsout.write( TEMPLATE.format( name = line ) + "\n" )

    line = fsin.readline()

fsout.write( FOOTER + "\n" )
