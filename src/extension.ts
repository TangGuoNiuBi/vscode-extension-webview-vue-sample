import * as vscode from 'vscode'
import * as fs from 'fs'

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('vue.open', () => {
			CatCodingPanel.createOrShow(context.extensionUri)
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('vue.doRefactor', () => {
			if (CatCodingPanel.currentPanel) {
				CatCodingPanel.currentPanel.doRefactor()
			}
		})
	)
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out')]
	}
}

/**
 * Manages cat coding webview panels
 */
class CatCodingPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: CatCodingPanel | undefined

	public static readonly viewType = 'catCoding'

	private readonly _panel: vscode.WebviewPanel
	private readonly _extensionUri: vscode.Uri
	private _disposables: vscode.Disposable[] = []

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined

		// If we already have a panel, show it.
		if (CatCodingPanel.currentPanel) {
			CatCodingPanel.currentPanel._panel.reveal(column)
			return
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			CatCodingPanel.viewType,
			'Webview Vue Sample',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		)

		CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionUri)
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel
		this._extensionUri = extensionUri
		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

		this._panel.webview.html = this._getHtmlForWebview(panel.webview).replaceAll("{{contextPath}}", panel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "out", "dist")).toString())

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showInformationMessage(message.text)
						return
				}
			},
			null,
			this._disposables
		)
	}

	public doRefactor() {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'refactor' })
	}

	public dispose() {
		CatCodingPanel.currentPanel = undefined

		// Clean up our resources
		this._panel.dispose()

		while (this._disposables.length) {
			const x = this._disposables.pop()
			if (x) {
				x.dispose()
			}
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Local path to index.html in the webview
		const indexPath = vscode.Uri.joinPath(this._extensionUri, './out/dist/', 'index.html')
		// // Uri to load styles into webview
		// const stylesResetUri = webview.asWebviewUri(indexPath)
		console.log(webview.asWebviewUri(indexPath))
		// Use a nonce to only allow specific scripts to be run
		
		return fs.readFileSync(indexPath.fsPath, 'utf-8')
	}
}