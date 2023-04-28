let array = [
    [],
    [ [ 450, 3 ], [ 600, 2 ], [ 950, 0 ] ],
    [],
    [ [ 450, 1 ], [ 550, 4 ] ],
    [ [ 850, 5 ] ],
    []
  ];

  let tmp = [600, 2];

  let newArray = array.map(subarray => subarray.filter(element => !isEqual(element, tmp)));

  function isEqual(arr1, arr2) {
    return arr1[0] === arr2[0] && arr1[1] === arr2[1];
  }

  console.log(newArray);
