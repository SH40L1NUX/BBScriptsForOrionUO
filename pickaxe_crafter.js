
function Pickaxe()
{
    // ==================================================
    // CONFIGURATION
    // ==================================================

    var ironIngotsType = '0x1BEF';
    var woodenLogsType = '0x1BDD';
    var pickaxeType = '0x0E85';
    var itemColor = '0xFFFF';

    var ironIngotsNeeded = 200;
    var woodenLogsNeeded = 50;
    var pickaxesPerBatch = 30;

    // REPLENISHMENT THRESHOLDS
    var ironReplenishThreshold = 10;
    var logsReplenishThreshold = 5;

    // FIXED MATERIAL CONTAINERS
    var ironContainer = '0x401CD5F8';
    var logsContainer = '0x402FE8E0';

    // JOURNAL MESSAGES
    var fullMessage = 'That container is full';
    var cannotHoldMessage = 'That container cannot hold more items.';

    // ==================================================
    // PRODUCTION STATISTICS
    // ==================================================

    var totalAttempts = 0;
    var successfulAttempts = 0;
    var failedAttempts = 0;
    var craftedSinceStart = 0;

    // ==================================================
    // SELECT INITIAL DESTINATION
    // ==================================================

    function selectDestination()
    {
        Orion.Print('Target a container for finished pickaxes.');
        Orion.AddObject('pickaxeDestination');

        if (!Orion.WaitForAddObject('pickaxeDestination', 30000)) {
            Orion.Print('No destination selected. Stopping.');
            return null;
        }

        var serial = Orion.GetSerial('pickaxeDestination');

        if (!serial || serial === '0x00000000') {
            Orion.Print('Invalid destination container. Stopping.');
            return null;
        }

        Orion.Print('Pickaxe destination: ' + serial);
        return serial;
    }

    var pickaxeDestination = selectDestination();

    if (pickaxeDestination === null) {
        return;
    }

    // ==================================================
    // STATISTICS
    // ==================================================

    function getSuccessRate()
    {
        if (totalAttempts === 0) {
            return 0;
        }

        return (successfulAttempts / totalAttempts) * 100;
    }

    function printStatistics()
    {
        Orion.Print('========== PRODUCTION REPORT ==========');
        Orion.Print('Crafting attempts: ' + totalAttempts);
        Orion.Print('Successful attempts: ' + successfulAttempts);
        Orion.Print('Failed attempts: ' + failedAttempts);
        Orion.Print('Total pickaxes produced: ' + craftedSinceStart);
        Orion.Print(
            'Crafting success rate: ' +
            getSuccessRate().toFixed(2) + '%'
        );
        Orion.Print('=======================================');
    }

    // ==================================================
    // COLLECT MATERIALS
    // ==================================================

    function collectMaterial(graphic, requiredAmount, container)
    {
        var currentAmount = Orion.Count(
            graphic, itemColor, 'backpack'
        );

        var amountNeeded = requiredAmount - currentAmount;

        if (amountNeeded <= 0) {
            return true;
        }

        Orion.Print('Collecting material: ' + graphic);

        Orion.OpenContainer(container);
        Orion.Wait(1000);

        var items = Orion.FindType(graphic, itemColor, container);

        for (var i = 0; i < items.length; i++) {
            if (amountNeeded <= 0) {
                break;
            }

            var item = Orion.FindObject(items[i]);

            if (item === null) {
                continue;
            }

            var stackAmount = item.Count();
            var moveAmount = Math.min(stackAmount, amountNeeded);

            if (moveAmount <= 0) {
                continue;
            }

            Orion.MoveItem(items[i], moveAmount, 'backpack');
            Orion.Wait(1200);

            currentAmount = Orion.Count(
                graphic, itemColor, 'backpack'
            );

            amountNeeded = requiredAmount - currentAmount;
        }

        currentAmount = Orion.Count(
            graphic, itemColor, 'backpack'
        );

        if (currentAmount < requiredAmount) {
            Orion.Print(
                'Insufficient material ' + graphic +
                '. Required: ' + requiredAmount +
                ', available: ' + currentAmount
            );
            return false;
        }

        Orion.Print('Material replenished: ' + currentAmount);
        return true;
    }

    // ==================================================
    // DESTINATION CONTAINER HANDLING
    // ==================================================

    function destinationIsFull()
    {
        return Orion.InJournal(fullMessage) ||
               Orion.InJournal(cannotHoldMessage);
    }

    function chooseReplacementDestination()
    {
        Orion.Print('Destination container cannot accept more items.');
        Orion.Print('Target a NEW container for finished pickaxes.');

        Orion.RemoveObject('pickaxeDestination');
        Orion.AddObject('pickaxeDestination');

        if (!Orion.WaitForAddObject('pickaxeDestination', 60000)) {
            Orion.Print('No replacement selected. Stopping.');
            return null;
        }

        var serial = Orion.GetSerial('pickaxeDestination');

        if (!serial || serial === '0x00000000' ||
            serial === pickaxeDestination) {
            Orion.Print('Invalid or unchanged destination. Stopping.');
            return null;
        }

        Orion.Print('New pickaxe destination: ' + serial);
        return serial;
    }

    // ==================================================
    // DEPOSIT PICKAXES
    // ==================================================

    function depositPickaxes()
    {
        var pickaxes = Orion.FindType(
            pickaxeType, itemColor, 'backpack'
        );

        if (pickaxes.length < pickaxesPerBatch) {
            return true;
        }

        Orion.Print('Depositing ' + pickaxesPerBatch + ' pickaxes.');

        for (var i = 0; i < pickaxes.length &&
                        i < pickaxesPerBatch; i++) {

            Orion.ClearJournal(fullMessage);
            Orion.ClearJournal(cannotHoldMessage);

            Orion.MoveItem(pickaxes[i], 1, pickaxeDestination);
            Orion.Wait(700);

            if (destinationIsFull()) {
                var replacement = chooseReplacementDestination();

                if (replacement === null) {
                    return false;
                }

                pickaxeDestination = replacement;

                // Retry the same pickaxe in the new container.
                i--;
                continue;
            }
        }

        Orion.Wait(1000);

        Orion.Print('Batch deposit operation completed.');
        return true;
    }

    // ==================================================
    // CRAFT ONE PICKAXE
    // ==================================================

    function craftOnePickaxe()
    {
        Orion.UseType(ironIngotsType);

        if (!Orion.WaitForMenu(3000)) {
            Orion.Print('Crafting menu did not open. Retrying.');
            Orion.Wait(1500);
            return false;
        }

        var menu0 = Orion.GetMenu('last');

        if (menu0 === null || menu0.Name() !== 'Blacksmithing') {
            Orion.Print('Blacksmithing menu not detected.');
            return false;
        }

        menu0.Select('Tools');

        if (!Orion.WaitForMenu(3000)) {
            Orion.Print('Tools menu did not open.');
            return false;
        }

        var menu1 = Orion.GetMenu('last');

        if (menu1 === null || menu1.Name() !== 'Tools') {
            Orion.Print('Tools menu not detected.');
            return false;
        }

        menu1.Select('Pick axe');
        Orion.Wait(1500);

        return true;
    }

    // ==================================================
    // INITIAL MATERIAL COLLECTION
    // ==================================================

    Orion.Print('Collecting Iron Ingots...');

    if (!collectMaterial(
        ironIngotsType, ironIngotsNeeded, ironContainer
    )) {
        Orion.Print('Stopped: insufficient Iron Ingots.');
        return;
    }

    Orion.Print('Collecting Wooden Logs...');

    if (!collectMaterial(
        woodenLogsType, woodenLogsNeeded, logsContainer
    )) {
        Orion.Print('Stopped: insufficient Wooden Logs.');
        return;
    }

    Orion.Print('Materials collected successfully.');
    Orion.Print('Starting pickaxe production.');

    printStatistics();

    // ==================================================
    // MAIN PRODUCTION LOOP
    // ==================================================

    while (true) {

        // CHECK DESTINATION STATUS
        if (destinationIsFull()) {
            Orion.ClearJournal(fullMessage);
            Orion.ClearJournal(cannotHoldMessage);

            var replacement = chooseReplacementDestination();

            if (replacement === null) {
                Orion.Print('Stopped: destination change failed.');
                printStatistics();
                return;
            }

            pickaxeDestination = replacement;
        }

        // REPLENISH IRON
        var currentIron = Orion.Count(
            ironIngotsType, itemColor, 'backpack'
        );

        if (currentIron < ironReplenishThreshold) {
            Orion.Print('Iron below threshold. Replenishing...');

            if (!collectMaterial(
                ironIngotsType, ironIngotsNeeded, ironContainer
            )) {
                Orion.Print('Stopped: unable to replenish Iron Ingots.');
                printStatistics();
                return;
            }
        }

        // REPLENISH LOGS
        var currentLogs = Orion.Count(
            woodenLogsType, itemColor, 'backpack'
        );

        if (currentLogs < logsReplenishThreshold) {
            Orion.Print('Logs below threshold. Replenishing...');

            if (!collectMaterial(
                woodenLogsType, woodenLogsNeeded, logsContainer
            )) {
                Orion.Print('Stopped: unable to replenish Wooden Logs.');
                printStatistics();
                return;
            }
        }

        // DEPOSIT COMPLETE BATCHES
        var currentPickaxes = Orion.Count(
            pickaxeType, itemColor, 'backpack'
        );

        if (currentPickaxes >= pickaxesPerBatch) {
            if (!depositPickaxes()) {
                Orion.Print('Deposit failed. Stopping.');
                printStatistics();
                return;
            }

            continue;
        }

        // RECORD CURRENT PICKAXE COUNT
        var previousCount = currentPickaxes;

        // OPEN MENU AND SELECT PICKAXE RECIPE
        if (!craftOnePickaxe()) {
            Orion.Wait(1000);
            continue;
        }

        // WAIT FOR THE CRAFTING RESULT
        Orion.Wait(1000);

        var newCount = Orion.Count(
            pickaxeType, itemColor, 'backpack'
        );

        // COUNT THE CRAFTING ATTEMPT
        totalAttempts++;

        if (newCount > previousCount) {
            successfulAttempts++;
            craftedSinceStart += newCount - previousCount;

            Orion.Print('Pickaxe crafted successfully.');
        } else {
            failedAttempts++;

            Orion.Print('Pickaxe crafting failed.');
        }

        // FULL REPORT EVERY 10 ATTEMPTS
        if (totalAttempts % 10 === 0) {
            printStatistics();
        }
    }
}
