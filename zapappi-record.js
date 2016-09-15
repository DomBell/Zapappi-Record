// Answer the Call
var callerID = config.GetKeyValue("Caller-ID");
var receiverNum = config.GetKeyValue("Receiver-Number");
var provider = config.GetKeyValue("Provider");
call.Voice = "da-DK"
call.Answer();
//Ask caller to say there name and record response
call.Say("Please say your name after the tone, then press the hash key.");
var nameRec = call.Record({
    Format: "wav",
    Timeout: 5,
    MaxSilence: 2,
    Beep: true,
    EscapeDigit: "#"
});
//Call callee with Timeout, CallerId, Call Limit, Call Limit Warning
var rtn = call.Dial(["tel:" + receiverNum + "@" + provider], {
        Timeout: 30,
        CallerID: callerID,
        Limit: 20,
        LimitWarning:10,
        //If LimitWarning reached proceed with function
        OnLimitWarning: function(LimitWarning){
            
            call.Say("You have " + LimitWarning + " seconds remaining");
            //call.Say("You have 10 seconds remaining");
        },
        //If Limit is reached
        OnLimitReached: function(){
            call.Say("Goodbye");
            call.Hangup();
        },
        //If Callee answers
        OnAnswer: function(){
            call.Say("You are being called by");
            //Play recorded name
            call.Play(nameRec.Filename);
            //Store user key response
            var answer = call.Say("Please enter 1 to accept call",{
                MaxDigits: 1,
                Timeout: 20
            });
            //If user key response is 1, accept call
            if(answer == "1")
            {
                return true;
            }
            //if user key response not 1, hangup
            return false;
        }
        }
);
        
sys.Trace("Call returned " + rtn.Disposition + ", with a Ringtime of "
    + rtn.Ringtime.TotalSeconds + "s, and a Talktime of "
    + rtn.TalkTime.TotalSeconds + "s. "
    + rtn.WhoHungUp + " hungup.");

 
// Hangup
call.Hangup();


