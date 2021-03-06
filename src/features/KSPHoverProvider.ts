/* =========================================================================

    KSPHoverProvider.ts
    Copyright(c) R-Koubou

    [License]
    MIT

   ======================================================================== */

// Implemented based on Part of PHP HOver Provider implementation. (hoverProvider.ts)

'use strict';

import vscode = require( 'vscode' );

var kspBuiltinVariables = require( './generated/KSPCompletionVariable' );
var kspCommands         = require( './generated/KSPCompletionCommand' );

export class KSPHoverProvider implements vscode.HoverProvider
{
    /**
     * Ctor.
     */
    constructor()
    {}

    /**
     * Implementation of Hover behaviour
     */
    public provideHover( textDocument: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken ) : vscode.Hover
    {
        let wordRange: vscode.Range = textDocument.getWordRangeAtPosition( position );
        if( !wordRange )
        {
            return null;
        }

        let name: string = textDocument.getText( wordRange );
        let entry : any  = kspCommands.CompletionList[ name ] || kspBuiltinVariables.CompletionList[ name ];

        if( entry && entry.description )
        {
            let signature = entry.signature || '';
            let contents  = [ entry.description, { language: 'ksp', value: signature } ];
            return new vscode.Hover( contents, wordRange );
        }
        return null;
    }
}
