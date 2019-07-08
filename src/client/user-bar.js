class UserBarItem{
   	
	/**
	 * Constructs a UserBar object
	 * @constructor
	 * @param {string} userName Username associated with this UserBarItem
	 * @param {Object} userBarDiv HTML div element associated with the UserBarItemr
	 * @param {string} Socket id of the user associated with this UserBarItemr
	 */
	constructor(userName, userBarItemDiv, socketID){
        	this._userName = userName;
		this._userBarItemDiv = userBarDiv;
	}
	
	/**
	 * Returns the user name assocaited with this UserBarItem
	 * @return {string} The user name
	 */
	get userName(){return this._userName;}

	/**
	 * Returns the HTML div associated with this UserBarItem
	 * @return {Object} The HTML div element
	 */
	get userBarItemDiv(){return this._userBarItemDiv;}
}
