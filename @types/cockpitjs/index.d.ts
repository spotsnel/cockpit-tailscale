declare namespace Cockpit {   
    /**********************************
    * Some helpful primitive typedefs
    *********************************/

    type integer = number;  //A typedef for an integer. Doesn't actually prevent compilation, but provides an IDE hint

    /**********************************
    * Cockpit D-Bus
    * http://cockpit-project.org/guide/latest/cockpit-dbus.html
    *********************************/

    type BYTE = number;
    type BOOLEAN = boolean;
    type INT16 = number;
    type UINT16 = number;
    type INT32 = number;
    type UINT32 = number;
    type INT64 = number;
    type UINT64 = number;
    type DOUBLE = number;
    type STRING = string;
    type OBJECT_PATH = string;
    type SIGNATURE = string;
    type ARRAY_BYTE = string[];    
    type ARRAY_DICT_ENTRY_STRING = object;
    type ARRAY_DICT_ENTRY_OTHER = object;
    type ARRAY_OTHER = any[]; 
    interface VARIANT {
        "t": STRING,
        "v": any
    }
    //TODO - Not sure on specifics for handle
    type HANDLE = object;    

    interface DBusOptions {
        "bus" : string        
        "host" : string        
        "superuser" : string    
        "track" : string
    }

    interface DBusProxy {
        client : string
        path : string
        iface : string
        valid : boolean     
        data : object
           
    }

    //Todo unfinished
    interface DBusClient {
        
    }

    /**********************************
    * Cockpit File Access
    * http://cockpit-project.org/guide/latest/cockpit-file.html
    **********************************/

    interface ParsingFunction {
        (data: string) : string
    }

    interface StringifyingFunction {
        (data: string) : string        
    }

    interface SyntaxObject {
        parse: ParsingFunction
        stringify: StringifyingFunction
    }

    interface FileAccessOptions {
        syntax?: SyntaxObject,
        binary?: boolean,
        max_read_size?: integer,
        superuser?: string,
        host?: string
    }

    interface FileReadDoneCallback {
        (content: string,  tag: string) : void
    }

    interface FileReadFailCallback {
        (error: string) : void
    }

    interface FileReadPromise {
        done (callback : FileReadDoneCallback) : FileReadPromise
        fail (callback : FileReadFailCallback) : FileReadPromise
    }

    interface FileReplaceDoneCallback {
        (newTag: string) : void
    }

    interface FileReplaceFailCallback {
        (error: string) : void
    }

    interface FileReplacePromise {
        done (callback : FileReplaceDoneCallback) : FileReplacePromise
        fail (callback : FileReplaceFailCallback) : FileReplacePromise
    }

    interface FileModifyDoneCallback {
        (newContent : string, newTag: string) : void
    }

    interface FileModifyFailCallback {
        (error: string) : void
    }

    interface FileModifyPromise {
        done (callback : FileModifyDoneCallback) : FileModifyPromise
        fail (callback : FileModifyFailCallback) : FileModifyPromise
    }

    interface FileWatchCallback {
        content : string,
        tag : string,
        error? : any        //TODO - what is the error content?
    }

    interface File {
        read () : FileReadPromise
        replace (content : string, expected_tag?: string) : FileReplacePromise
        modify (callback : any, initial_content?: string, initial_tag?: string) : FileModifyPromise
        watch (callback : FileWatchCallback) : void
        close () : void
    }

    /**********************************
    * Cockpit Processes
    * http://cockpit-project.org/guide/latest/cockpit-spawn.html
    **********************************/

    interface ProcessFailureException {
        message?: string
        problem?: string
        exit_status?: integer
        exit_signal?: string
    }

    enum ProcessProblemCodes {
        "access-denied",                 //"The user is not permitted to perform the action in question."
        "authentication-failed",         //"User authentication failed."
        "internal-error",                //"An unexpected internal error without further info. This should not happen during the normal course of operations."
        "no-cockpit",                    //"The system does not have a compatible version of Cockpit installed or installed properly."
        "no-session",                    //"Cockpit is not logged in."
        "not-found",                     //"Something specifically requested was not found, such as a file, executable etc."
        "terminated",                    //"Something was terminated forcibly, such as a connection, process session, etc."
        "timeout",                       //"Something timed out."
        "unknown-hostkey",               //"The remote host had an unexpected or unknown key."
        "no-forwarding"                  //"Could not forward authentication credentials to the remote host."
    }

    interface ProcessPromiseDoneCallback {
        (data: string,  message?: string) : void
    }

    interface ProcessPromiseFailCallback {
        (exception: ProcessFailureException,  data?: string) : void
    }

    interface ProcessPromiseStreamCallback {
        (data: string) : void
    }

    interface ProcessPromise {
        done( callback: ProcessPromiseDoneCallback ) : ProcessPromise,
        fail( callback: ProcessPromiseFailCallback ) : ProcessPromise,
        stream( callback: ProcessPromiseStreamCallback ) : ProcessPromise,
        input( data: string, stream?: boolean ) : ProcessPromise,
        close( problem?: ProcessProblemCodes ) : ProcessPromise,
    }

    /**********************************
    * Cockpit User Session
    * http://cockpit-project.org/guide/latest/cockpit-login.html
    **********************************/

    interface UserSessionPermission {
        allowed : boolean
        onChanged : any     //TODO need to see how to do events in TS
        close() : void
    }

    interface UserSessionObject {
        onchanged : any
    }

    interface UserSessionDetails {
        "id" : string            //This is unix user id.
        "name" : string          //This is the unix user name like "root".
        "full_name" : string     //This is a readable name for the user.
        "groups" : string        //This is an array of group names to which the user belongs.
        "home" : string          //This is user's home directory.
        "shell" : string         //This is unix user shell.
    }

    interface UserSessionPromiseDoneCallback {
        (user: UserSessionDetails) : void
    }

    interface UserSessionPromiseFailCallback { //Todo - is this defined?

    }

    interface UserSessionPromise {

    }

    /**********************************
    * Cockpit Object
    * Generally brought into your app in the root HTML file via a <script>
    **********************************/

    interface CockpitObject {

        //File system
        file(path : string, options? : FileAccessOptions) : File

        //Processes
        spawn(
            arguments: Array<string>,
            parameters?: object
        ): ProcessPromise;

        //User Session
        logout(reload? : boolean) : void
        user() : UserSessionPromise
        //user : UserSessionObject // TODO ts doesn't like this
        
    }
}


declare var cockpit : Cockpit.CockpitObject;
