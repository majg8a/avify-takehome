import React, { useEffect, useState } from "react";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    generationmix: [],
  });

  const [sortingType, setSortingType] = useState("default");
  const [generationmix, setGenerationmix] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://api.carbonintensity.org.uk/generation"
        );
        const data = (await res.json()).data;
        setData(data);
        setGenerationmix(data.generationmix);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const newGenerationmix = [...data?.generationmix].sort((a, b) => {
      switch (sortingType) {
        default:
          return 0;
        case "asc":
          return a.perc - b.perc;
        case "desc":
          return b.perc - a.perc;
      }
    });
    setGenerationmix(newGenerationmix);
  }, [sortingType, data]);

  const renderLoading = () => {
    const visibleLoading = {
      opacity: isLoading ? "1" : "0",
      visibility: isLoading ? "visible" : "hidden",
    };
    return (
      <div
        style={{
          transition: "all 1s ease-out",
          display: "grid",
          placeItems: "center",
          height: "100%",
          width: "100%",
          position: "fixed",
          ...visibleLoading,
        }}
      >
        <h1
          style={{
            fontFamily: "Arial",
            fontSize: "5vw",
          }}
        >
          Loading...
        </h1>
      </div>
    );
  };

  const renderData = (generationmix) => {
    const visibleData = {
      opacity: isLoading ? "0" : "1",
      visibility: isLoading ? "hidden" : "visible",
    };

    const renderGenerationMixItem = (generationMixItem) => {
      return (
        <div key={generationMixItem.fuel}>
          <h3 style={{ textTransform: "uppercase" }}>
            {generationMixItem?.fuel}
          </h3>
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                transition: "all 2s ease-out",
                height: "4vw",
                width: `${generationMixItem.perc}vw`,
                background: "#4BB543",
              }}
            ></div>
            <div
              style={{
                display: "grid",
                alignContent: "center",
                position: "absolute",
                top: "0",
                height: "100%",
              }}
            >
              <h3
                style={{
                  fontSize: "3vw",
                  margin: "0px",
                  paddingLeft: "1vw",
                  filter: "contrast(20%)",
                }}
              >
                {generationMixItem.perc}
              </h3>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          transition: "all 1s ease-out",
          fontFamily: "Arial",
          padding: "2vw",
          ...visibleData,
        }}
      >
        <h1
          style={{
            fontSize: "3vw",
          }}
        >
          UK energy generation data
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
          }}
        >
          <h2 style={{ fontSize: "2vw" }}>
            FROM:{" "}
            <span
              style={{
                color: "#eed202",
              }}
            >
              {data?.from}
            </span>
          </h2>
          <h2 style={{ fontSize: "2vw" }}>
            TO:{" "}
            <span
              style={{
                color: "#eed202",
              }}
            >
              {data?.to}
            </span>
          </h2>
        </div>

        <div
          style={{
            fontSize: "1.5vw",
          }}
        >
          <label> Sorting type:</label>
          <br />
          <select
            style={{
              fontSize: "1.5vw",
            }}
            onChange={(e) => setSortingType(e.target.value)}
          >
            <option value="default">default</option>
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            rowGap: "2vw",
          }}
        >
          {generationmix.map((generationMixItem) =>
            renderGenerationMixItem(generationMixItem)
          )}
        </div>
      </div>
    );
  };
  const json = JSON.stringify(generationmix);
  return (
    <>
      {renderLoading()}
      {renderData(generationmix)}
    </>
  );
};

export { App };
