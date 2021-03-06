/* =========================================================================

    KSPSymbolUtil.ts
    Copyright(c) R-Koubou

    [License]
    MIT

   ======================================================================== */

import vscode = require( 'vscode' );

export enum KSPSymbolType
{
    UNKNOWN,
    VARIABLE_TYPE_BEGIN,
    VARIABLE_INTEGR = VARIABLE_TYPE_BEGIN,
    VARIABLE_REAL,
    VARIABLE_STRING,
    VARIABLE_INTEGR_ARRAY,
    VARIABLE_REAL_ARRAY,
    VARIABLE_STRING_ARRAY,
    VARIABLE_TYPE_END = VARIABLE_STRING_ARRAY,

    CALLBACK,
    USER_FUNCTION
}

/**
 * General Symbol information for KSP
 */
export class KSPSymbol
{
    public name                 : string = "";
    public kspSymbolType        : KSPSymbolType = KSPSymbolType.UNKNOWN;
    public variableTypeName     : string  = "";
    public isConst              : boolean = false;
    public isPolyphonic         : boolean = false;
    public isUI                 : boolean = false;
    public uiVariableName       : string  = ""; // if isUI == true and type == callback, set a uiVariable Name
    public uiVariableType       : string  = ""; // if isUI == true and type == callback, set a UI type Name
    public description          : string  = "";
    public lineNumber           : number  = -1;
    public column               : number  = -1;

    public toVariableNameFormat( isUI : boolean = false ) : string
    {
        let ret = this.name;
        if( isUI )
        {
            ret = this.uiVariableName;
        }

        switch( this.kspSymbolType )
        {
            case KSPSymbolType.VARIABLE_INTEGR:         return '$' + ret;
            case KSPSymbolType.VARIABLE_REAL:           return '~' + ret;
            case KSPSymbolType.VARIABLE_STRING:         return '@' + ret;
            case KSPSymbolType.VARIABLE_INTEGR_ARRAY:   return '%' + ret;
            case KSPSymbolType.VARIABLE_REAL_ARRAY:     return '?' + ret;
            case KSPSymbolType.VARIABLE_STRING_ARRAY:   return '!' + ret;
            case KSPSymbolType.CALLBACK:                return '$' + ret;
            default:  return ret;
        }
    }

    static variableTypeChar2Type( char : string ) : KSPSymbolType
    {
        switch( char )
        {
            case '$': return KSPSymbolType.VARIABLE_INTEGR;
            case '~': return KSPSymbolType.VARIABLE_REAL;
            case '@': return KSPSymbolType.VARIABLE_STRING;
            case '%': return KSPSymbolType.VARIABLE_INTEGR_ARRAY;
            case '?': return KSPSymbolType.VARIABLE_REAL_ARRAY;
            case '!': return KSPSymbolType.VARIABLE_STRING_ARRAY;
            default:  return KSPSymbolType.UNKNOWN;
        }
    }

    static variableTypeChar2String( char : string ) : string
    {
        switch( char )
        {
            case '$': return "Integer";
            case '~': return "Real";
            case '@': return "String";
            case '%': return "Integer Array";
            case '?': return "Real Array";
            case '!': return "String Array";
            default:  return "Unkown";
        }
    }

    static variableType2Char( type : KSPSymbolType ) : string
    {
        switch( type )
        {
            case KSPSymbolType.VARIABLE_INTEGR:         return '$';
            case KSPSymbolType.VARIABLE_REAL:           return '~';
            case KSPSymbolType.VARIABLE_STRING:         return '@';
            case KSPSymbolType.VARIABLE_INTEGR_ARRAY:   return '%';
            case KSPSymbolType.VARIABLE_REAL_ARRAY:     return '?';
            case KSPSymbolType.VARIABLE_STRING_ARRAY:   return '!';
            default:  return "Unkown";
        }
    }

    static isVariable( name : string ) : boolean
    {
        const type : KSPSymbolType = KSPSymbol.variableTypeChar2Type( name.charAt( 0 ) );
        switch( type )
        {
            case KSPSymbolType.VARIABLE_INTEGR:
            case KSPSymbolType.VARIABLE_REAL:
            case KSPSymbolType.VARIABLE_STRING:
            case KSPSymbolType.VARIABLE_INTEGR_ARRAY:
            case KSPSymbolType.VARIABLE_REAL_ARRAY:
            case KSPSymbolType.VARIABLE_STRING_ARRAY:
                return true;
            default:
                return false;
        }
    }

    static isArrayVariable( type: KSPSymbolType ) : boolean
    {
        switch( type )
        {
            case KSPSymbolType.VARIABLE_INTEGR_ARRAY:
            case KSPSymbolType.VARIABLE_REAL_ARRAY:
            case KSPSymbolType.VARIABLE_STRING_ARRAY:
                return true;
            default:
                return false;
        }
    }
}

/**
 * Symbol information for KSP (vscode.SymbolInformation extension)
 */
export class KSPSymbolInformation extends vscode.SymbolInformation
{
    private kspSymbol: KSPSymbol;
    public range: vscode.Range          = undefined;
    public selectionRange: vscode.Range = undefined;

    constructor( name: string,
                 kind: vscode.SymbolKind,
                 containerName: string,
                 location: vscode.Location,
                 range?: vscode.Range,
                 selectionRange?: vscode.Range )
    {
        super( name, kind,containerName, location );
        this.containerName              = containerName;
        this.kspSymbol                  = new KSPSymbol();
        this.kspSymbol.description      = containerName;
        this.range                      = range;
        this.selectionRange             = selectionRange;
    }

    public setKspSymbolValue( lineNumber : number, column : number, isConst : boolean, isPolyphonic : boolean, isUI : boolean, type : KSPSymbolType, vaiableTypeName: string = "" )
    {
        this.KspSymbol.name          = this.name;
        this.KspSymbol.lineNumber    = lineNumber;
        this.KspSymbol.column         = column;
        this.KspSymbol.isConst       = isConst;
        this.KspSymbol.isPolyphonic  = isPolyphonic;
        this.KspSymbol.isUI          = isUI;
        this.KspSymbol.kspSymbolType = type;
        this.KspSymbol.variableTypeName = vaiableTypeName;
    }

    public isVariable() : boolean
    {
        switch( this.kspSymbol.kspSymbolType )
        {
            case KSPSymbolType.VARIABLE_INTEGR:
            case KSPSymbolType.VARIABLE_REAL:
            case KSPSymbolType.VARIABLE_STRING:
            case KSPSymbolType.VARIABLE_INTEGR_ARRAY:
            case KSPSymbolType.VARIABLE_REAL_ARRAY:
            case KSPSymbolType.VARIABLE_STRING_ARRAY:
                return true;
            default:
                return false;
        }
    }

    public isUserFunction() : boolean
    {
        switch( this.kspSymbol.kspSymbolType )
        {
            case KSPSymbolType.USER_FUNCTION:
                return true;
            default:
                return false;
        }
    }

    get KspSymbol() : KSPSymbol { return this.kspSymbol; }

}

export class KSPSymbolUtil
{
    public static readonly REGEX_SYMBOL_BOUNDARY : RegExp     = /[\s|\(|\)|\{|\}|:|\[|\]|,|\+|-|\/|\*|<|>|\^|"]+/g
    public static readonly REGEX_SYMBOL_BOUNDARY_STR : string = "[\\s|\\(|\\)|\\{|\\}|:|\\[|\\]|,|\\+|-|\\/|\\*|<|>|\\^|\\\"]+";

    static startAt( lineText:string, position:vscode.Position ) : number
    {
        for( let i = position.character - 1; i >= 0; i-- )
        {
            let regex : RegExp = new RegExp( KSPSymbolUtil.REGEX_SYMBOL_BOUNDARY );
            let char  = lineText.charAt( i );
            let match = regex.exec( char );
            if( match )
            {
                return i + 1;
            }
        }
        return position.character;
    }

    static endAt( lineText:string, position:vscode.Position ) : number
    {
        for( let i = position.character + 1; i < lineText.length; i++ )
        {
            let regex : RegExp = new RegExp( KSPSymbolUtil.REGEX_SYMBOL_BOUNDARY );
            let char  = lineText.charAt( i );
            let match = regex.exec( char );
            if( match )
            {
                return i - 1;
            }
        }
        return position.character;
    }

    static parseSymbolAt( document: vscode.TextDocument, position: vscode.Position ) : string
    {
        let textLine : vscode.TextLine = document.lineAt( position.line );
        let line   : string = textLine.text;
        let eolPos : number = line.length;
        let symbol : string = "";
        for( let i = position.character; i < eolPos; i++ )
        {
            let regex : RegExp = KSPSymbolUtil.REGEX_SYMBOL_BOUNDARY;
            let char  = line.charAt( i );
            let match = regex.exec( char );
            if( match )
            {
                if( char == '"' )
                {
                    // Literal String
                    symbol += '"';
                }
                break;
            }
            symbol += char;
        }
        for( let i = position.character - 1; i >= 0; i-- )
        {
            let regex : RegExp = KSPSymbolUtil.REGEX_SYMBOL_BOUNDARY;
            let char  = line.charAt( i );
            let match = regex.exec( char );
            if( match )
            {
                if( char == '"' )
                {
                    // Literal String
                    symbol = '"' + symbol;
                }
                break;
            }
            symbol = char + symbol;
        }
        return symbol.trim();
    }

    static collect( document: vscode.TextDocument, endLineNumber: number = -1 ) : KSPSymbolInformation[]
    {
        let result: KSPSymbolInformation[] = [];

        // store for "on ui_control( <variable> )"
        let callBackUITypeNameTable: {[key:string]: string } = {}; // key: variable name, value: type

        let count = document.lineCount;
        if( endLineNumber >= 0 )
        {
            count = endLineNumber;
        }
        for( let i = 0; i < count; i++ )
        {
            let isConst: boolean = false;
            let range: vscode.Range          = undefined;
            let selectionRange: vscode.Range = undefined;

            //-----------------------------------------------------------------
            // check declare variables
            //-----------------------------------------------------------------
            {
                let DECLARE_REGEX = /^\s*declare\s+(ui_[a-zA-Z0-9_]+|const|polyphonic)?\s*([\$%~\?@!][a-zA-Z0-9_]+)/g;

                let text  = document.lineAt( i ).text;
                let match = DECLARE_REGEX.exec( text );
                if( match )
                {
                    isConst                         = match[ 1 ] && match[ 1 ].toString() === "const";
                    let isPolyphonic                = match[ 1 ] && match[ 1 ].toString() === "polyphonic";
                    let isUI                        = match[ 1 ] && match[ 1 ].startsWith( "ui_" );
                    let symKind: vscode.SymbolKind  = vscode.SymbolKind.Variable;
                    let name : string               = match[ 2 ];
                    let containerName : string      = "Variable";
                    let column : number             = text.indexOf( name );

                    let variableTypeChar            = name.charAt( 0 );
                    let variableTypeName : string   = KSPSymbol.variableTypeChar2String( variableTypeChar );
                    let symbolType : KSPSymbolType  = KSPSymbol.variableTypeChar2Type( variableTypeChar );

                    range          = new vscode.Range( new vscode.Position( i, text.indexOf( "declare" ) ), new vscode.Position( i, Number.MAX_VALUE ) );
                    selectionRange = new vscode.Range( new vscode.Position( i, column ), new vscode.Position( i, Number.MAX_VALUE ) );

                    if( isConst )
                    {
                        containerName = "Constant Variable";
                        symKind = vscode.SymbolKind.Constant;
                    }
                    else if( isPolyphonic )
                    {
                        containerName = "Polyphonic Variable";
                    }
                    else if( isUI )
                    {
                        containerName = "UI Variable";
                        variableTypeName  = match[ 1 ].trim();
                        callBackUITypeNameTable[ name ] = variableTypeName;
                    }

                    let add = new KSPSymbolInformation(
                        name.substr( 1 ),
                        symKind, containerName + " " + "(" + variableTypeName + ")",
                        new vscode.Location( document.uri, new vscode.Position( i, column ) ),
                        range,
                        selectionRange
                    );
                    add.setKspSymbolValue( i, text.indexOf( name ), isConst, isPolyphonic, isUI, symbolType, variableTypeName );
                    result.push( add );
                    continue;
                }
            } //~check declare variables
            //-----------------------------------------------------------------
            // check callback ( on #### )
            //-----------------------------------------------------------------
            {
                let DECLARE_REGEX = /^\s*(on\s+)([a-zA-Z0-9_]+)(\s*\(\s*[^\)]+\s*\))?/g;

                let text  = document.lineAt( i ).text;
                let match = DECLARE_REGEX.exec( text );
                if( match )
                {
                    let isUI                        = match[ 2 ] != undefined && match[ 3 ] != undefined && match[ 2 ].startsWith( "ui_" );
                    let uiName                      = null;
                    let symKind: vscode.SymbolKind  = vscode.SymbolKind.Function;
                    let name : string               = match[ 2 ];
                    let containerName : string      = "Callback";
                    let column : number             = text.indexOf( name );

                    range          = new vscode.Range( new vscode.Position( i, text.indexOf( "on " ) ), new vscode.Position( i, Number.MAX_VALUE ) );
                    selectionRange = new vscode.Range( new vscode.Position( i, column ), new vscode.Position( i, Number.MAX_VALUE ) );

                    if( !match[ 2 ] && !match[ 3 ] )
                    {
                        continue;
                    }

                    if( isUI )
                    {
                        uiName = match[ 3 ].replace( "(", "" ).replace( ")", "" ).trim();
                        containerName = "UI Callback for " + uiName;
                    }

                    let add = new KSPSymbolInformation(
                        name,
                        symKind, containerName,
                        new vscode.Location( document.uri, new vscode.Position( i, column ) ),
                        range,
                        selectionRange
                    );
                    if( uiName )
                    {
                        if( callBackUITypeNameTable[ uiName ] )
                        {
                            add.KspSymbol.uiVariableType = callBackUITypeNameTable[ uiName ];
                        }
                        add.KspSymbol.uiVariableName = uiName.substr( 1 ) // [0] == variable type character
                    }

                    add.setKspSymbolValue( i, column, isConst, false, isUI, KSPSymbolType.CALLBACK );
                    result.push( add );
                    continue;
                }
            } //~callback
            //-----------------------------------------------------------------
            // check user function ( function #### )
            //-----------------------------------------------------------------
            {
                let DECLARE_REGEX = /^\s*(function\s+)([a-zA-Z0-9_]+)/g;

                let text  = document.lineAt( i ).text;
                let match = DECLARE_REGEX.exec( text );
                if( match )
                {
                    let symKind: vscode.SymbolKind  = vscode.SymbolKind.Function;
                    let name : string               = match[ 2 ];
                    let containerName : string      = "Function";
                    let column : number             = text.indexOf( name );

                    range          = new vscode.Range( new vscode.Position( i, text.indexOf( "function " ) ), new vscode.Position( i, Number.MAX_VALUE ) );
                    selectionRange = new vscode.Range( new vscode.Position( i, column ), new vscode.Position( i, Number.MAX_VALUE ) );

                    let add = new KSPSymbolInformation(
                        name,
                        symKind, containerName,
                        new vscode.Location( document.uri, new vscode.Position( i, column ) ),
                        range,
                        selectionRange
                    );

                    add.setKspSymbolValue( i, column, isConst, false, false, KSPSymbolType.USER_FUNCTION );
                    result.push( add );
                    continue;
                }
            } //~function
        }

        return result;
    }
}
