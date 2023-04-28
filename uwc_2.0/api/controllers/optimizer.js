import { MinPriorityQueue } from '@datastructures-js/priority-queue';


export const OptimizerController = {
    Optimizer: (req, res) => {
        const inf = 10000;
        const rootDis = [[2500, 1200, 1500, 2100, 2100, 3200], [2100, 2900, 3600, 2500, 1400, 3700]]
        const distance = [
            [0, 950, 1200, 1600, 1700, 2400],
            [950, 0, 600, 850, 1300, 2200],
            [1200, 600, 0, 1400, 1800, 2700],
            [1600, 850, 1400, 0, 550, 1500],
            [1700, 1300, 1800, 550, 0, 850],
            [2400, 2200, 2700, 1500, 850, 0],
        ]

        let PointsInfo = []
        let Weight = new Array(10).fill(inf);
        let mark = new Array(10).fill(false);
        let visited = new Array(10).fill(0);
        let MCPs = req.body.MCPs;

        let Parent = []
        let Data = [];
        let start = -1;

        for (let point in MCPs)
        {
            let location = point
            let num = parseInt(location.slice(5));
            if (MCPs[point].isAvailable === true && start === -1) start = num;
            PointsInfo.push({ point: MCPs[point], minDist: inf, index: num, namePoint: point})
        }

        const isEqual = (arr1, arr2) => {
            return arr1[0] === arr2[0] && arr1[1] === arr2[1];
        }

                //find bottle neck point => O(n^2)
        // >= 3 ==> seem as bottle neck
        let arrayBottleNeck = Array.from({ length: distance.length }, () => []);
        let modArrayBottleNeck = []
        let bottleNeckIdx = []
        const FindBottleNeck = () => {
            for(let idx = 0; idx < distance.length;idx++)
            {
                let row = PointsInfo[idx].index;
                if(PointsInfo[idx].point.isAvailable === false) {
                    // idx++;
                    continue;
                }
                let minVal = inf;
                let minIdx = 0;
                for(let col = 0; col < row + 1; col++)
                {
                    if(PointsInfo[col].point.isAvailable === false) continue;
                    if(distance[row][col] !== 0 && minVal > distance[row][col])
                    {

                        minVal = distance[row][col];
                        minIdx = col;
                    }
                }
                console.log("minVal: ", minVal)
                console.log("minIdx: ", minIdx);
                arrayBottleNeck[minIdx].push([minVal, row])
            }
            console.log(arrayBottleNeck);
            arrayBottleNeck.forEach((subArray, index) => {
                subArray.sort((a,b) => a[0] - b[0])
                if(subArray.length >= 2) bottleNeckIdx.push(index)
            })
            console.log("---------")
            console.log(arrayBottleNeck);
            console.log("bottleNeckIndex:",bottleNeckIdx);
            modArrayBottleNeck = arrayBottleNeck.map(subarray => subarray.slice(0, 1))
            console.log("mod: ", modArrayBottleNeck);
        }


        let upperbound = PointsInfo.length + 1;

        const MCPsQueue = new MinPriorityQueue((point) => point.minDist);
        const MCPsOrder = new MinPriorityQueue((point) => point.minDist);


        const minSpanning = (start) => {
            PointsInfo[start].minDist = 0;
            Parent[PointsInfo[start].index] = upperbound; //assign to out of array range
            Weight[PointsInfo[start].index] = 0;
            MCPsOrder.enqueue(PointsInfo[start]);

            while (!MCPsOrder.isEmpty()) {
                const curPoint = MCPsOrder.pop();
                if (Weight[curPoint.index] < curPoint.minDist) continue;
                mark[curPoint.index] = true;

                PointsInfo.forEach((adjPoint) => {
                    const gap = distance[curPoint.index][adjPoint.index];

                    if (gap === 0 || mark[adjPoint.index] === true || adjPoint.point.isAvailable === false) {
                        return;
                    }

                    console.log("idx: ",curPoint.index, adjPoint.index, Weight[adjPoint.index], gap, Weight[adjPoint.index]> gap)
                    //if find bottle neck
                    if (Weight[adjPoint.index] > gap) {
                        if(bottleNeckIdx.includes(curPoint.index))
                        {
                            if(modArrayBottleNeck[curPoint.index].some(subarray => subarray[1] === adjPoint.index))
                            {
                                console.log("test")
                                console.log(modArrayBottleNeck[curPoint.index])
                            }
                            else return;
                        }
                        Weight[adjPoint.index] = gap
                        let tmpPoint = {...adjPoint}
                        tmpPoint.minDist = gap;
                        MCPsOrder.enqueue(tmpPoint);
                        Parent[tmpPoint.index] = curPoint.index;
                    }
                })
            }
            let begin = -1;
            let finish = 0;
            let count = new Array(Parent.length).fill(0);
            Parent.forEach((value, index) => {
                console.log(index, value)
                count[value]++;
                count[index]++;
            })
            count[start]--;
            console.log("--------------------")
            count.forEach((node, index) => {
                console.log('count: ', index, node)
                if(index === upperbound) return;
                if (node === 1 && begin === -1) begin = index;
                else if (node === 1) finish = index;
                else if (node !== 1 && node > 0) {
                    Data.push(index);
                }
            })
            if (rootDis[0][begin] > rootDis[0][finish]) {
                let Tmp = begin;
                begin = finish;
                finish = Tmp;
            }
            Data.unshift(begin);
            Data.unshift('deport');
            Data.push(finish);
            Data.push('treatment')
        }
        FindBottleNeck();
        minSpanning(start);
        return res.status(200).json(Data);
    }

    // const minPath = (start, end) => {
    //     PointsInfo[start].minDist = 0;
    //     Parent[PointsInfo[start].index] = 0
    //     MCPsQueue.enqueue(PointsInfo[start]);

    //     while (!MCPsQueue.isEmpty()) {
    //         const curPoint = MCPsQueue.pop();
    //         if (curPoint.minDist > PointsInfo[curPoint.index].minDist) continue;
    //         PointsInfo.forEach((adjPoint) => {
    //             const gap = distance[curPoint.index][adjPoint.index];

    //             if (gap === 0) return;

    //             if (adjPoint.minDist > curPoint.minDist + gap) {
    //                 adjPoint.minDist = curPoint.minDist + gap;
    //                 MCPsQueue.enqueue(adjPoint);
    //                 Parent[adjPoint.index] = curPoint.index;
    //             }
    //         })
    //     }
    //     Data.push(PointsInfo[end].namePoint)
    //     while (end != start) {
    //         Data.push(PointsInfo[Parent[end]].namePoint);
    //         end = Parent[end];
    //     }
    // }

}


